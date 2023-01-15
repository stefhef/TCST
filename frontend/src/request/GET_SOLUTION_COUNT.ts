import {gql} from "@apollo/client";

const GET_SOLUTION_COUNT = gql`
query GetSolutionCount($groupId: Int!, $courseId: Int!, $taskId: Int!) {
	get_solution_count(group_id: $groupId, course_id: $courseId, task_id: $taskId) {
		solutions_count,
		solutions_complete_count,
		solutions_complete_not_max_count,
		solutions_complete_error_count,
		solutions_complete_on_review_count,
		solutions_undefined_count
  }
}`;

export default GET_SOLUTION_COUNT;