import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info

from database.users_groups import UserGroupRole
from models.pydantic_sqlalchemy_core import GroupDto
from models.site_graphql.group import GroupsResponse
from services.users_groups_service import UsersGroupsService


@strawberry.type(name="Query", extend=True)
class GroupQuery:

    @strawberry.field
    async def get_role(self, info: Info, group_id: int) -> UserGroupRole:
        current_user = info.context["current_user"]
        session = info.context["session"]
        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")
        return user_group.role

    @strawberry.field
    async def get_all_groups(self, info: Info) -> GroupsResponse:
        current_user = info.context["current_user"]
        session = info.context["session"]
        user_groups = await UsersGroupsService.get_user_groups(current_user.id,
                                                               session)
        groups = list(map(lambda t: t.group, user_groups))
        groups_dto = list(map(lambda t: GroupDto.from_orm(t), groups))
        return GroupsResponse(groups=sorted(groups_dto, key=lambda t: t.id))
