import logging
import strawberry
from fastapi import Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from starlette import status
from strawberry.types import Info
from database import User
from strawberry.fastapi import GraphQLRouter
from database import get_session
from models.pydantic_sqlalchemy_core import CourseDto
from models.site_graphql.course import CoursesResponse, CoursesResponseGQL
from services.auth_service import get_current_active_user
from services.group_service import GroupService
from services.users_groups_service import UsersGroupsService


async def get_context(
        current_user: User = Depends(get_current_active_user),
        session: AsyncSession = Depends(get_session)
):
    logging.debug("Get context")
    return {
        "current_user": current_user,
        "session": session
    }


@strawberry.type
class Query:
    @strawberry.field
    async def courses(self, info: Info, group_id: int) -> CoursesResponseGQL:
        logging.debug("Taaaaak")

        current_user = info.context["current_user"]
        # logging.debug(f"Current_user: {current_user}")
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
        return CoursesResponseGQL(courses=courses_dto)

    # @strawberry.field
    # def course(self, info: Info):
    #     return "One course"

# @router.get("/get_all", response_model=CoursesResponse)
# async def get_courses(group_id: int,
#                       current_user: User = Depends(get_current_active_user),
#                       session: AsyncSession = Depends(get_session)) -> CoursesResponse:
#     user_group = await UsersGroupsService.get_user_group(user_id=current_user.id,
#                                                          group_id=group_id,
#                                                          session=session)

    # group = await GroupService.get_group_by_id_with_courses(group_id, session)
    # courses_dto = list(map(lambda t: CourseDto.from_orm(t.course), group.courses))
    # return CoursesResponse(courses=courses_dto)

schema = strawberry.Schema(Query)

graphql_router = GraphQLRouter(
    path="/v2/auth",
    schema=schema,
    context_getter=get_context,
)
