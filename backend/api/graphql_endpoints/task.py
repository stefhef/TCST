from fastapi import HTTPException
from starlette import status

import strawberry
from strawberry.types import Info

from database import User
from database.solution import SolutionStatus
from models.pydantic_sqlalchemy_core import TaskDto
from models.site_graphql.task import TasksResponse, AttachmentData, Attachment, \
    TaskResponse, TaskCountForStudentResponse, TaskCountForTeacherResponse

from services.auth_service import get_teacher_or_admin
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.lessons_tasks_service import LessonsTasksService
from services.solution_service import SolutionService
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
    async def get_all_tasks(self, info: Info,
                            group_id: int,
                            course_id: int,
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
        return TaskResponse(task=t[0])

    @strawberry.field
    async def get_task_count(self, info: Info,
                             group_id: int,
                             course_id: int,
                             lesson_id: int) -> TaskCountForStudentResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]

        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        course_group = await GroupsCoursesService.get_group_course(group_id, course_id, session)
        if not course_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
        if not course_lesson:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to lesson")

        tasks = await TaskService.get_tasks_by_lesson_id(lesson_id, session)
        tasks_complete_count = 0
        tasks_complete_not_max_count = 0
        tasks_complete_error_count = 0
        tasks_complete_on_review_count = 0
        tasks_undefined_count = 0
        for task in tasks:
            solution = await SolutionService.get_best_user_solution(group_id,
                                                                    course_id,
                                                                    task.id,
                                                                    current_user.id,
                                                                    session)
            if not solution:
                tasks_undefined_count += 1
            elif solution.status == SolutionStatus.ERROR:
                tasks_complete_error_count += 1
            elif solution.status == SolutionStatus.ON_REVIEW:
                tasks_complete_on_review_count += 1
            elif solution.status == SolutionStatus.COMPLETE_NOT_MAX:
                tasks_complete_not_max_count += 1
            elif solution.status == SolutionStatus.COMPLETE:
                tasks_complete_count += 1
            else:
                raise AttributeError("Task not detect!")

        return TaskCountForStudentResponse(tasks_count=len(tasks),
                                           tasks_complete_count=tasks_complete_count,
                                           tasks_complete_not_max_count=tasks_complete_not_max_count,
                                           tasks_complete_error_count=tasks_complete_error_count,
                                           tasks_complete_on_review_count=tasks_complete_on_review_count,
                                           tasks_undefined_count=tasks_undefined_count)

    @strawberry.field
    async def get_task_count_for_teacher(self, info: Info,
                                         group_id: int,
                                         course_id: int,
                                         lesson_id: int) -> TaskCountForTeacherResponse:
        session = info.context["session"]
        current_user = await get_teacher_or_admin(current_user=info.context["current_user"],
                                                  session=session)

        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        course_group = await GroupsCoursesService.get_group_course(group_id, course_id, session)
        if not course_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        course_lesson = await CoursesLessonsService.get_course_lesson(course_id, lesson_id, session)
        if not course_lesson:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to lesson")

        tasks = await TaskService.get_tasks_by_lesson_id(lesson_id, session)
        group_students = await UsersGroupsService.get_group_students(group_id, session)
        students = list(map(lambda g_u: g_u.user, group_students))
        students_count = len(students)
        students_with_all_completed_tasks = 0
        if tasks:
            for student in students:
                student: User
                is_all = True

                for task in tasks:
                    best_solution = await SolutionService \
                        .get_best_user_solution(group_id,
                                                course_id,
                                                task.id,
                                                student.id,
                                                session)
                    if best_solution and best_solution.status != SolutionStatus.COMPLETE:
                        is_all = False
                        break
                    elif not best_solution:
                        is_all = False
                        break
                if is_all:
                    students_with_all_completed_tasks += 1
        else:
            students_with_all_completed_tasks = 0

        return TaskCountForTeacherResponse(students_count=students_count,
                                           students_with_all_completed_tasks=students_with_all_completed_tasks)
