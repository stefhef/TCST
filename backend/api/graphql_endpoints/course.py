import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info
from models.pydantic_sqlalchemy_core import CourseDto
from models.site_graphql.course import CoursesResponse
from services.group_service import GroupService
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
