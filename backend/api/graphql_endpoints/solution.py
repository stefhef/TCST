from typing import Union

import strawberry
from strawberry.types import Info

from database.solution import SolutionStatus
from models.site_graphql.solution import SolutionResponse, SolutionsCountResponse
from models.pydantic_sqlalchemy_core import SolutionDto

from services.auth_service import get_teacher_or_admin
from services.solution_service import SolutionService
from services.users_groups_service import UsersGroupsService


@strawberry.type
class SolutionQuery:

    @strawberry.field
    async def get_solution_best(self, info: Info,
                                group_id: int,
                                course_id: int,
                                task_id: int,
                                user_id: int = None) -> Union[SolutionResponse, None]:
        current_user = info.context["current_user"]
        session = info.context["session"]

        solution = await SolutionService.get_best_user_solution(group_id,
                                                                course_id,
                                                                task_id,
                                                                (
                                                                    user_id if user_id else current_user.id),
                                                                session)
        if solution:
            return SolutionResponse.from_pydantic(SolutionDto.from_orm(solution))

        solution_on_review = await SolutionService.get_user_solution_on_review(group_id,
                                                                               course_id,
                                                                               task_id,
                                                                               (
                                                                                   user_id if user_id else current_user.id),
                                                                               session)
        if solution_on_review:
            return SolutionResponse.from_pydantic(SolutionDto.from_orm(solution_on_review))

    @strawberry.field
    async def get_solution_count(self, info: Info,
                                 group_id: int,
                                 course_id: int,
                                 task_id: int) -> SolutionsCountResponse:
        session = info.context["session"]
        current_user = await get_teacher_or_admin(current_user=info.context["current_user"],
                                                  session=session)

        user_groups = await UsersGroupsService.get_group_students(group_id, session)
        solutions_count = len(user_groups)

        solutions = await SolutionService.get_best_solutions(group_id, course_id, task_id, session)

        solutions_complete_count = len(
            list(filter(lambda sol: sol.status == SolutionStatus.COMPLETE, solutions)))
        solutions_complete_not_max_count = len(
            list(filter(lambda sol: sol.status == SolutionStatus.COMPLETE_NOT_MAX, solutions)))
        solutions_complete_error_count = len(
            list(filter(lambda sol: sol.status == SolutionStatus.ERROR, solutions)))
        solutions_complete_on_review_count = len(
            list(filter(lambda sol: sol.status == SolutionStatus.ON_REVIEW, solutions)))
        solutions_undefined_count = solutions_count \
                                    - solutions_complete_count \
                                    - solutions_complete_not_max_count \
                                    - solutions_complete_error_count \
                                    - solutions_complete_on_review_count

        return SolutionsCountResponse(solutions_count=solutions_count,
                                      solutions_complete_count=solutions_complete_count,
                                      solutions_complete_not_max_count=solutions_complete_not_max_count,
                                      solutions_complete_error_count=solutions_complete_error_count,
                                      solutions_complete_on_review_count=solutions_complete_on_review_count,
                                      solutions_undefined_count=solutions_undefined_count)
