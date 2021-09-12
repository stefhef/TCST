import ormar

from .base_meta import BaseMeta


class Solution(ormar.Model):
    class Meta(BaseMeta):
        tablename = "dbo_solution"

    id: int = ormar.Integer(primary_key=True, autoincrement=True)