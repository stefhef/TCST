from fastapi import HTTPException
from starlette import status

import strawberry
from strawberry.types import Info

from database.solution import SolutionStatus
from models.site.stat import TaskStat, LessonStat, CourseStatForStudent
from models.site_graphql.stat import CourseStatForStudentGQL

from services.course_service import CourseService
from services.courses_lessons_service import CoursesLessonsService
from services.groups_courses_serivce import GroupsCoursesService
from services.solution_service import SolutionService
from services.task_service import TaskService
from services.users_groups_service import UsersGroupsService


@strawberry.type
class StatQuery:

    @strawberry.field
    async def get_course_stat_for_student(self, info: Info,
                                          group_id: int,
                                          course_id: int) -> CourseStatForStudentGQL:
        current_user = info.context["current_user"]
        session = info.context["session"]

        # check group access
        user_group = await UsersGroupsService.get_user_group(current_user.id,
                                                             group_id,
                                                             session)
        if not user_group:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to group")

        group_course = await GroupsCoursesService.get_group_course(group_id,
                                                                   course_id,
                                                                   session)
        if not group_course:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bad access to course")
        course = await CourseService.get_course(course_id, session)
        course_lessons = await CoursesLessonsService.get_course_lessons(course_id, session)
        lessons = list(map(lambda c_l: c_l.lesson, course_lessons))
        lessons_dto = []
        for lesson in lessons:
            tasks = await TaskService.get_tasks_by_lesson_id(lesson.id, session)
            best_solutions = [await SolutionService.get_best_user_solution(group_id,
                                                                           course_id,
                                                                           task.id,
                                                                           current_user.id,
                                                                           session) for task in
                              tasks]
            tasks_dto = [(TaskStat(**task.to_dict() | ({"best_score": solution.score,
                                                        "status": solution.status} if solution else
                                                       {"best_score": 0,
                                                        "status": SolutionStatus.NOT_SENT})))
                         for task, solution in zip(tasks, best_solutions)]

            lesson_dto = LessonStat(**lesson.to_dict() | {"tasks": tasks_dto})
            lessons_dto.append(lesson_dto)
        course_dto = CourseStatForStudent.parse_obj(course.to_dict() | {"lessons": lessons_dto})

        return CourseStatForStudentGQL.from_pydantic(course_dto)
