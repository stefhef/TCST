from typing import List

import strawberry
from pydantic import BaseModel

from models.pydantic_sqlalchemy_core import GroupDto


@strawberry.experimental.pydantic.type(model=GroupDto, all_fields=True)
class GroupGQL:
    pass


class GroupsResponseDto(BaseModel):
    groups: List[GroupGQL]


@strawberry.experimental.pydantic.type(model=GroupsResponseDto, all_fields=True)
class GroupsResponse:
    pass

