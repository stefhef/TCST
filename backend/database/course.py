from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class Course(Base):
    __tablename__ = "dbo_course"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(40))
    description = Column(String(2000), nullable=True)

    groups = relationship("GroupsCourses", back_populates="course", lazy="selectin")
    lessons = relationship("CoursesLessons", back_populates="course", lazy="selectin")

