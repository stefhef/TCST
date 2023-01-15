from typing import List

import strawberry

from models.pydantic_sqlalchemy_core import LessonDto, TaskDto, CourseDto
from services.common import exclude_field, exclude_fields


@exclude_fields(["description", "attachments"])
class TaskStat(TaskDto):
    best_score: int
    status: int


@strawberry.experimental.pydantic.type(model=TaskStat, all_fields=True)
class TaskStatGQL:
    pass


@exclude_field("description")
class LessonStat(LessonDto):
    tasks: List[TaskStatGQL]


@strawberry.experimental.pydantic.type(model=LessonStat, all_fields=True)
class LessonStatGQL:
    pass


@exclude_field("description")
class CourseStatForStudent(CourseDto):
    lessons: List[LessonStatGQL]


@strawberry.experimental.pydantic.type(model=CourseStatForStudent, all_fields=True)
class CourseStatForStudentGQL:
    pass
