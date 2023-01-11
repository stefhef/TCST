import strawberry
from fastapi import HTTPException
from starlette import status
from strawberry.types import Info

from database.users_groups import UserGroupRole
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
