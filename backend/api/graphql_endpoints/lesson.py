import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info

from database.users_groups import UserGroupRole
from models.pydantic_sqlalchemy_core import LessonDto
from models.site.lesson import LessonDtoWithHiddenFlag
from services.course_service import CourseService
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.users_groups_service import UsersGroupsService

from models.site_graphql.lesson import LessonsResponse


@strawberry.type(name="Query", extend=True)
class LessonQuery:

    @strawberry.field
    async def get_lessons(self, info: Info, group_id: int,
                          course_id: int) -> LessonsResponse:
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
        course = await CourseService.get_course(course_id, session)
        course_lessons = await CoursesLessonsService.get_course_lessons(course_id, session)
        if user_group.role == UserGroupRole.STUDENT:
            lessons_dto = list(map(lambda t: LessonDto.from_orm(t.lesson),
                                   filter(lambda c_l: not c_l.is_hidden, course_lessons)))
        else:
            lessons_dto = list(map(lambda t: LessonDtoWithHiddenFlag(**t.lesson.to_dict(),
                                                                     is_hidden=t.is_hidden),
                                   course_lessons))
        return LessonsResponse(lessons=lessons_dto,
                               course_name=course.name,
                               course_description=course.description)

