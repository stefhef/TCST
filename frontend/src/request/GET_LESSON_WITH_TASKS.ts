import { gql } from '@apollo/client';

const GET_LESSON_WITH_TASKS = gql`
	query GET_LESSON_WITH_TASK($groupId: Int!, $courseId: Int!, $lessonId: Int!) {
		get_lesson(group_id: $groupId, course_id: $courseId, lesson_id: $lessonId) {
			id
			name
			description
		}
		get_all_tasks(
			group_id: $groupId
			course_id: $courseId
			lesson_id: $lessonId
		) {
			tasks {
				id
				description
				max_score
				name
				task_type
				attachments {
					attachment_type
					data {
						input
						output
					}
				}
			}
		}
		get_role(group_id: $groupId)
	}
`;

export default GET_LESSON_WITH_TASKS;
