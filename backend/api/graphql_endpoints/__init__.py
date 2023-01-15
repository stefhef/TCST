import strawberry
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from strawberry.fastapi import GraphQLRouter
from strawberry.schema.config import StrawberryConfig

from database import User, get_session
from services.auth_service import get_current_active_user

from .course import CourseQuery
from .lesson import LessonQuery
from .group import GroupQuery
from .solution import SolutionQuery
from .task import TaskQuery

import pickle


async def get_context(
        # current_user: User = Depends(get_current_active_user),
        session: AsyncSession = Depends(get_session)
):
    """Чтобы обойти авторизацию"""
    # with open(file='user2.txt', mode='wb') as f:
    #     pickle.dump(current_user, f, pickle.HIGHEST_PROTOCOL)
    with open('user2.txt', 'rb') as f:
        current_user = pickle.load(f)
    return {
        "current_user": current_user,
        "session": session
    }


@strawberry.type
class Query(CourseQuery, LessonQuery, GroupQuery, TaskQuery, SolutionQuery):
    """Query"""


schema = strawberry.Schema(Query,
                           config=StrawberryConfig(auto_camel_case=False))

graphql_router = GraphQLRouter(
    path="/graphql",
    schema=schema,
    context_getter=get_context,
)
