from typing import List, Optional

from models import TaskDto
from pydantic import BaseModel, validator

from models import BaseTaskDto


"""
BaseTaskDto.__fields__ == {'id': ModelField(name='id', type=int, required=True),
'name': ModelField(name='name', type=Optional[str], required=False, default=None),
'description': ModelField(name='description', type=Optional[str], required=False, default=None),
'max_score': ModelField(name='max_score', type=Optional[float], required=False, default=None)}
"""


class GroupCourseLessonResponse(BaseModel):
    tasks: List[TaskDto]
    lesson_name: str
    lesson_description: Optional[str]
