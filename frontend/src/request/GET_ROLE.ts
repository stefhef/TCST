import { gql } from '@apollo/client';

const GET_ROLE = gql`
	query GetRole($groupId: Int!) {
		get_role(group_id: $groupId)
	}
`;

export default GET_ROLE;
