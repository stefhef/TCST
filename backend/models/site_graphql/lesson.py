from typing import List, Union
from pydantic import BaseModel
from models.pydantic_sqlalchemy_core import LessonDto

import strawberry
from strawberry.experimental.pydantic import type


@type(model=LessonDto, all_fields=True)
class LessonGQL:
    pass


class LessonDtoWithHiddenFlag(LessonDto):
    is_hidden: bool


class LessonsResponseDto(BaseModel):
    lessons: Union[List[LessonDtoWithHiddenFlag], List[LessonDto]]


@strawberry.experimental.pydantic.type(model=LessonsResponseDto, all_fields=True)
class LessonsResponse:
    course_name: str
    course_description: Union[str, None]


class LessonResponse(LessonGQL):
    pass


class LessonRequest(LessonGQL):
    pass


@type(model=LessonDto)
class LessonPostRequest:
    name: strawberry.auto
    description: strawberry.auto


if __name__ == "__main__":
    ...
    # print(*LessonPostRequest.__fields__.items(), sep='\n')
