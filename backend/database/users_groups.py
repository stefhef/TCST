from enum import IntEnum

import strawberry
from sqlalchemy import Column, ForeignKey, Enum
from sqlalchemy.orm import relationship

from database.base_meta import BaseSQLAlchemyModel


# TODO Надо бы протестить
@strawberry.enum
class UserGroupRole(IntEnum):
    STUDENT: int = 0
    TEACHER: int = 1
    OWNER: int = 2


class UsersGroups(BaseSQLAlchemyModel):
    __tablename__ = "dbo_users_groups"

    user_id = Column(ForeignKey("dbo_user.id"), primary_key=True)
    group_id = Column(ForeignKey("dbo_group.id"), primary_key=True)
    role = Column(Enum(UserGroupRole))

    user = relationship("User", back_populates="groups")
    group = relationship("Group", back_populates="users")

    def __repr__(self):
        return f"GroupId:{self.group_id}, role:{self.role}"
