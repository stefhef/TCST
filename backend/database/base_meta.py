import logging
from typing import AsyncIterator, Dict, Any

from pydantic import BaseModel
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update as sqlalchemy_update, create_engine, inspect

from config import DATABASE_URL, SQL_ECHO, DATABASE_URL_SYNC
import database
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, exc, scoped_session

engine_async = create_async_engine(DATABASE_URL, future=True, echo=SQL_ECHO)
engine_sync = create_engine(DATABASE_URL_SYNC, echo=SQL_ECHO)
logging.debug(DATABASE_URL_SYNC)
Base = declarative_base()
metadata = Base.metadata
async_session_factory = sessionmaker(engine_async,
                                     expire_on_commit=False,
                                     class_=AsyncSession)
sync_session_factory = sessionmaker(engine_sync,
                                    autocommit=False)


class BaseSQLAlchemyModel(Base):
    __abstract__ = True

    def update(self, **kwargs):
        for key, value in kwargs.items():
            if hasattr(self, key):
                setattr(self, key, value)

    def update_by_pydantic(self, model: BaseModel):
        self.update(**model.dict(exclude_none=True))

    def __repr__(self) -> str:
        return self._repr(id=self.id)

    def to_dict(self):
        return {c.key: getattr(self, c.key) for c in inspect(self).mapper.column_attrs}

    def _repr(self, **fields: Dict[str, Any]) -> str:
        field_strings = []
        at_least_one_attached_attribute = False
        for key, field in fields.items():
            try:
                field_strings.append(f'{key}={field!r}')
            except exc.DetachedInstanceError:
                field_strings.append(f'{key}=DetachedInstanceError')
            else:
                at_least_one_attached_attribute = True
        if at_least_one_attached_attribute:
            return f"<{self.__class__.__name__}({','.join(field_strings)})>"
        return f"<{self.__class__.__name__} {id(self)}>"


async def initialize_database():
    #async with engine.begin() as database_connection:
        # await database_connection.run_sync(metadata.drop_all)
        # await database_connection.run_sync(metadata.create_all)
    pass


async def get_session() -> AsyncIterator[AsyncSession]:
    async with async_session_factory() as session:
        yield session


def get_sync_session() -> Session:
    session = sync_session_factory()
    return session

