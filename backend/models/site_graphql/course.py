from typing import List
import strawberry
from pydantic import BaseModel
from models.pydantic_sqlalchemy_core import CourseDto


@strawberry.experimental.pydantic.type(model=CourseDto, all_fields=True)
class CourseGQL:
    pass


class CoursesResponseDto(BaseModel):
    courses: List[CourseGQL]


@strawberry.experimental.pydantic.type(model=CoursesResponseDto, all_fields=True)
class CoursesResponse:
    pass


@strawberry.experimental.pydantic.type(model=CourseDto, all_fields=True)
class CourseRequest:
    pass


@strawberry.experimental.pydantic.type(model=CourseDto)
class CoursePostRequest:
    name: strawberry.auto
    description: strawberry.auto


class CoursePutRequest(CourseRequest):
    pass
