from enum import IntEnum

import strawberry
from sqlalchemy import Column, Integer, ForeignKey, Enum
from sqlalchemy.orm import relationship

from database.base_meta import BaseSQLAlchemyModel


@strawberry.enum
class TaskType(IntEnum):
    CLASS_WORK: int = 1
    HOME_WORK: int = 2
    ADDITIONAL_WORK: int = 3


class LessonsTasks(BaseSQLAlchemyModel):
    __tablename__ = "dbo_lessons_tasks"

    lesson_id = Column(ForeignKey("dbo_lesson.id"), primary_key=True)
    task_id = Column(ForeignKey("dbo_task.id"), primary_key=True)
    queue_number = Column(Integer)
    task_type = Column(Enum(TaskType))

    lesson = relationship("Lesson", back_populates="tasks")
    task = relationship("Task", back_populates="lessons")
