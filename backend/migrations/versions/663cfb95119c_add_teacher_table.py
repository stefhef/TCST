"""add teacher table

Revision ID: 663cfb95119c
Revises: a26f13a43ee8
Create Date: 2021-06-30 17:21:40.131148

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '663cfb95119c'
down_revision = '0b4a507ed621'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('dbo_teacher',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user'], ['dbo_user.id'], name='fk_dbo_teacher_dbo_user_id_user'),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('dbo_teacher')
    # ### end Alembic commands ###
