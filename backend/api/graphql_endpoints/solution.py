import strawberry
from strawberry.types import Info

from models.site_graphql.solution import SolutionResponse
from services.solution_service import SolutionService

from models.pydantic_sqlalchemy_core import SolutionDto


@strawberry.type
class SolutionQuery:

    @strawberry.field
    async def get_solution_best(self, info: Info,
                                group_id: int,
                                course_id: int,
                                task_id: int,
                                user_id: int = None) -> SolutionResponse | None:
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
