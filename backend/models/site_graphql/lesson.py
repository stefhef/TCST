from typing import List
from models.pydantic_sqlalchemy_core import LessonDto

import strawberry


@strawberry.experimental.pydantic.type(model=LessonDto, all_fields=True)
class LessonGQL:
    pass


@strawberry.type
class LessonGQLWithHiddenFlag(LessonGQL):
    is_hidden: bool


@strawberry.type
class LessonsResponse:
    lessons: List[LessonGQL]


@strawberry.type
class LessonsResponseWithFlag:
    lessons: List[LessonGQLWithHiddenFlag]


@strawberry.type
class LessonResponse(LessonGQL):
    pass


class LessonRequest(LessonGQL):
    pass


@strawberry.experimental.pydantic.type(model=LessonDto)
class LessonPostRequest:
    name: strawberry.auto
    description: strawberry.auto


if __name__ == "__main__":
    ...
    # print(*LessonPostRequest.__fields__.items(), sep='\n')
