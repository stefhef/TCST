import { gql } from '@apollo/client';

const CHANGE_VISIBLE = gql`
	mutation ChangeVisible(
		$groupId: Int!
		$courseId: Int!
		$lessonId: Int!
		$isHidden: Boolean!
	) {
		change_visibility(
			group_id: $groupId
			course_id: $courseId
			lesson_id: $lessonId
			is_hidden: $isHidden
		)
	}
`;

export default CHANGE_VISIBLE;
