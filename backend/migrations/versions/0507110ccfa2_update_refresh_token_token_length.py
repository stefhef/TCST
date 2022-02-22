"""update refresh_token.token length

Revision ID: 0507110ccfa2
Revises: 
Create Date: 2022-02-17 22:49:04.680170

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0507110ccfa2'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('dbo_refresh_token', 'token',
               existing_type=sa.VARCHAR(length=100),
               type_=sa.String(length=200),
               existing_nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('dbo_refresh_token', 'token',
               existing_type=sa.String(length=200),
               type_=sa.VARCHAR(length=100),
               existing_nullable=True)
    # ### end Alembic commands ###