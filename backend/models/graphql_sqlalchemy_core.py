from typing import Optional

from pydantic_sqlalchemy import sqlalchemy_to_pydantic
from database import User, Group, Course, Lesson, Task, Solution, ChatMessage, CoursesLessons

from strawberry_sqlalchemy_mapper import StrawberrySQLAlchemyMapper

strawberry_sqlalchemy_mapper = StrawberrySQLAlchemyMapper()


@strawberry_sqlalchemy_mapper.type(Course)
class CourseGrq:
    pass


@strawberry_sqlalchemy_mapper.type(Lesson)
class LessonGrq:
    pass


@strawberry_sqlalchemy_mapper.type(CoursesLessons)
class CoursesLessonsGrq:
    pass


@strawberry_sqlalchemy_mapper.type(User)
class UserGra:
    __exclude__ = ["password", "vk_access_token"]


@strawberry_sqlalchemy_mapper.type(Group)
class GroupGrq:
    pass


@strawberry_sqlalchemy_mapper.type(Solution)
class SolutionGrq:
    pass


@strawberry_sqlalchemy_mapper.type(ChatMessage)
class ChatMessageGrq:
    pass


class TaskDto(sqlalchemy_to_pydantic(Task)):
    task_type: Optional[int]
    attachments: Optional[list]

    class Config:
        orm_mode = True
        allow_population_by_field_name = True


strawberry_sqlalchemy_mapper.finalize()
