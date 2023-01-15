import {gql} from "@apollo/client";

const GET_LESSONS_COURSE_ROLE = gql`
query GetLessonsCoursesRole($courseId: Int!, $groupId: Int!) {
	get_role(group_id: $groupId),
	get_lessons(group_id: $groupId, course_id: $courseId) {
		... on LessonsResponse {
		  lessons {
			id,
			name,
			description
        }
    },
		... on LessonsResponseWithFlag {
		  lessons {
			id,
			name,
			description,
			is_hidden
		  }
		}
	},
	get_course(group_id: $groupId, course_id: $courseId) {
		id,
		name,
		description
    }
}`;

export default GET_LESSONS_COURSE_ROLE;