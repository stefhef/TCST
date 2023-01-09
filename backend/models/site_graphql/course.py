from typing import List

import strawberry
from pydantic import BaseModel

from models.graphql_sqlalchemy_core import CourseGrq
from services.common import exclude_field


class CoursesResponse(BaseModel):
    courses: List[CourseGrq]


@strawberry.experimental.pydantic.type(model=CoursesResponse)
class CoursesResponseGQL:
    courses: strawberry.auto


class CourseRequest(CourseGrq):
    pass


@exclude_field("id")
class CoursePostRequest(CourseRequest):
    pass


class CoursePutRequest(CourseRequest):
    pass


class CourseResponse(CourseGrq):
    pass
