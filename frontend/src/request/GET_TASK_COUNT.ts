import { gql } from '@apollo/client';

const GET_TASK_COUNT = gql`
	query GetTaskCount($groupId: Int!, $courseId: Int!, $lessonId: Int!) {
		get_task_count(
			group_id: $groupId
			course_id: $courseId
			lesson_id: $lessonId
		) {
			tasks_count
			tasks_complete_count
			tasks_complete_not_max_count
			tasks_complete_error_count
			tasks_complete_on_review_count
			tasks_undefined_count
		}
	}
`;

export default GET_TASK_COUNT;
