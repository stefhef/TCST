from fastapi import HTTPException
from starlette import status

import strawberry
from strawberry.types import Info

from models.pydantic_sqlalchemy_core import CourseDto, GroupDto
from models.site_graphql.course import CoursesResponse, AllCoursesResponse, CourseWithGroup, \
    CourseGQL

from services.auth_service import get_teacher_or_admin
from services.courses_lessons_service import CoursesLessonsService
from services.group_service import GroupService
from services.groups_courses_serivce import GroupsCoursesService
from services.users_groups_service import UsersGroupsService


@strawberry.type(name="Query", extend=True)
class CourseQuery:

    @strawberry.field
    async def get_courses(self, info: Info, group_id: int) -> CoursesResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]

        user_group = await UsersGroupsService.get_user_group(user_id=current_user.id,
                                                             group_id=group_id,
                                                             session=session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        group = await GroupService.get_group_by_id_with_courses(group_id, session)
        courses_dto = list(map(lambda t: CourseDto.from_orm(t.course), group.courses))
        return CoursesResponse(courses=courses_dto)

    @strawberry.field
    async def get_course(self, info: Info, group_id: int, course_id: int) -> CourseGQL:
        current_user = info.context["current_user"]
        session = info.context["session"]
        user_group = await UsersGroupsService.get_user_group(user_id=current_user.id,
                                                             group_id=group_id,
                                                             session=session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")
        group_course = await GroupsCoursesService.get_group_course_with_courses(group_id, course_id,
                                                                                session)
        return CourseGQL.from_pydantic(CourseDto.from_orm(group_course.course))

    @strawberry.field
    async def get_all_courses(self, info: Info) -> AllCoursesResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]

        user_groups = await UsersGroupsService.get_user_groups(user_id=current_user.id,
                                                               session=session)
        if not user_groups:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")
        all_courses = []
        for gr in user_groups:
            group = await GroupService.get_group_by_id_with_courses(gr.group_id, session)
            courses_dto = list(
                map(lambda x: CourseWithGroup(course=x, group=GroupDto.from_orm(group)),
                    map(lambda t: CourseDto.from_orm(t.course), group.courses)))
            all_courses.extend(courses_dto)
        return AllCoursesResponse(courses=sorted(all_courses, key=lambda c: c.course.id))


@strawberry.type(name="Mutation", extend=True)
class CourseMutation:

    @strawberry.field
    async def change_visibility(self, info: Info,
                                group_id: int,
                                course_id: int,
                                lesson_id: int,
                                is_hidden: bool) -> bool:
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

        course_lesson.is_hidden = is_hidden
        await session.commit()
        return is_hidden
