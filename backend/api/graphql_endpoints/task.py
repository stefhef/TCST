import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info

from models.pydantic_sqlalchemy_core import TaskDto
from models.site_graphql.task import TasksResponse, AttachmentData, Attachment
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lessons_tasks_service import LessonsTasksService
from services.users_groups_service import UsersGroupsService


@strawberry.type
class TaskQuery:

    @strawberry.field
    async def get_all_tasks(self, info: Info, group_id: int, course_id: int,
                            lesson_id: int) -> TasksResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]

        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")
        # check group access
        group_course = await GroupsCoursesService.get_group_course(group_id, course_id, session)
        if not group_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to course")
        course_lesson = await CoursesLessonsService.get_course_lesson(course_id,
                                                                      lesson_id,
                                                                      session)
        if not course_lesson:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to lesson")
        lesson_tasks = await LessonsTasksService.get_lesson_tasks(lesson_id, session)
        tasks_dto = list(
            map(lambda t: TaskDto(**t.task.to_dict(), task_type=t.task_type), lesson_tasks))
        for i in range(len(tasks_dto)):
            attachment = tasks_dto[i].attachments[0]
            attachment_data = AttachmentData(**attachment.get("data", None))
            attachment = Attachment(data=attachment_data,
                                    attachment_type=attachment.get("attachment_type", None))
            tasks_dto[i].attachments = attachment
        return TasksResponse(tasks=tasks_dto)
