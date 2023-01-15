from typing import List

import strawberry

from database.lessons_tasks import TaskType


@strawberry.type
class AttachmentData:
    input: List[str]
    output: List[str]


@strawberry.type
class Attachment:
    attachment_type: str
    data: AttachmentData


@strawberry.type
class TaskGQL:
    description: str
    id: int
    max_score: float
    name: str
    task_type: int  # TaskType
    attachments: Attachment


@strawberry.type
class TasksResponse:
    tasks: List[TaskGQL]


@strawberry.type
class TaskResponse:
    task: TaskGQL
