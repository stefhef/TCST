import strawberry

from models.pydantic_sqlalchemy_core import SolutionDto


@strawberry.experimental.pydantic.type(model=SolutionDto)
class SolutionResponse:
    status: int
    id: strawberry.auto
    task_id: strawberry.auto
    user_id: strawberry.auto
    course_id: strawberry.auto
    group_id: strawberry.auto

    score: strawberry.auto
    code: strawberry.auto
    time_start: strawberry.auto
    time_finish: strawberry.auto
    check_system_answer: strawberry.auto


@strawberry.type
class SolutionsCountResponse:
    solutions_count: int
    solutions_complete_count: int
    solutions_complete_not_max_count: int
    solutions_complete_error_count: int
    solutions_complete_on_review_count: int
    solutions_undefined_count: int
