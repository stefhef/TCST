import {gql} from "@apollo/client";

const GET_COURSE_STAT_FOR_STUDENT = gql`
query GetCourseStatForStudent($groupId: Int!, $courseId: Int!) {
  get_course_stat_for_student(group_id: $groupId, course_id: $courseId) {
    lessons {
      name,
      tasks {
        status,
        name,
        max_score,
        best_score
      }
    }
  }
}`;

export default GET_COURSE_STAT_FOR_STUDENT;