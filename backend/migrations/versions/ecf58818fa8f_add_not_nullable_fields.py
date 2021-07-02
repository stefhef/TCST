"""add not nullable fields

Revision ID: ecf58818fa8f
Revises: 6b53f19d1950
Create Date: 2021-05-22 00:54:06.355182

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = 'ecf58818fa8f'
down_revision = '6b53f19d1950'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('dbo_task', 'max_score',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False)
    op.alter_column('dbo_users_courses_tasks', 'score',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('dbo_users_courses_tasks', 'score',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True)
    op.alter_column('dbo_task', 'max_score',
               existing_type=postgresql.DOUBLE_PRECISION(precision=53),
               nullable=True)
    # ### end Alembic commands ###
