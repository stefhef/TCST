import { gql } from '@apollo/client';

const GET_TASK_COUNT_FOR_TEACHER = gql`
	query GetTaskCountForTeacher(
		$groupId: Int!
		$courseId: Int!
		$lessonId: Int!
	) {
		get_task_count_for_teacher(
			group_id: $groupId
			course_id: $courseId
			lesson_id: $lessonId
		) {
			students_count
			students_with_all_completed_tasks
		}
	}
`;

export default GET_TASK_COUNT_FOR_TEACHER;
