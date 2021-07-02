"""edit user task conection

Revision ID: e9c3dd3cf37a
Revises: 601e6cf26674
Create Date: 2021-07-02 13:50:59.060357

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e9c3dd3cf37a'
down_revision = '601e6cf26674'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_constraint('fk_dbo_users_courses_tasks_dbo_course_id_course', 'dbo_users_courses_tasks', type_='foreignkey')
    op.drop_column('dbo_users_courses_tasks', 'course')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('dbo_users_courses_tasks', sa.Column('course', sa.INTEGER(), autoincrement=False, nullable=True))
    op.create_foreign_key('fk_dbo_users_courses_tasks_dbo_course_id_course', 'dbo_users_courses_tasks', 'dbo_course', ['course'], ['id'], ondelete='CASCADE')
    # ### end Alembic commands ###
