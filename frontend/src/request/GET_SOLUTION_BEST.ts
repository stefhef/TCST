import { gql } from '@apollo/client';

const GET_SOLUTION_BEST = gql`
	query GetSolutionBest($groupId: Int!, $courseId: Int!, $taskId: Int!) {
		get_solution_best(
			group_id: $groupId
			course_id: $courseId
			task_id: $taskId
		) {
			id
			task_id
			user_id
			course_id
			group_id
			score
			code
			status
			time_start
			time_finish
			check_system_answer
		}
	}
`;

export default GET_SOLUTION_BEST;
