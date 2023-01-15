import {gql} from "@apollo/client";

const GET_LESSONS_COURSES_ROLE = gql`query GetLessonsCoursesRole($courseId: Int!, $groupId: Int!) {
        get_role(group_id: $groupId),
        get_lessons(group_id: $groupId, course_id: $courseId) {
            lessons {
                id,
                name,
                description
            }
        },
        get_courses(group_id: $groupId) {
            courses {
                id,
                name,
                description,

            }
        }
    }`

export default GET_LESSONS_COURSES_ROLE;