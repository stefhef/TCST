import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info

from models.pydantic_sqlalchemy_core import TaskDto
from models.site_graphql.task import TasksResponse, AttachmentData, Attachment, TaskGQL, \
    TaskResponse
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lessons_tasks_service import LessonsTasksService
from services.task_service import TaskService
from services.users_groups_service import UsersGroupsService


async def reformat_attachment(*tasks):
    for i in range(len(tasks)):
        attachment = tasks[i].attachments[0]
        attachment_data = AttachmentData(**attachment.get("data", None))
        attachment = Attachment(data=attachment_data,
                                attachment_type=attachment.get("attachment_type", None))
        tasks[i].attachments = attachment
    return tasks


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
        return TasksResponse(tasks=await reformat_attachment(*tasks_dto))

    @strawberry.field
    async def get_task(self, info: Info,
                       group_id: int,
                       course_id: int,
                       lesson_id: int,
                       task_id: int) -> TaskResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]

        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")
        group_course = await GroupsCoursesService.get_group_course(group_id,
                                                                   course_id,
                                                                   session)
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
        lesson_task = await LessonsTasksService.get_lesson_task(lesson_id, task_id, session)
        if not lesson_task:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to task")
        task = await TaskService.get_task_by_id(lesson_task.task_id, session)
        task_dto = TaskDto.from_orm(task)
        t = await reformat_attachment(task_dto)
        print(t)
        # tt = TaskGQL(t[0])
        return TaskResponse(task=t[0])
