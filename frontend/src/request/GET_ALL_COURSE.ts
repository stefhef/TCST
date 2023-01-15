import { gql } from '@apollo/client';

const ALL_COURSE = gql`
	query AllCourse {
		get_all_courses {
			courses {
				course {
					id
					name
					description
				}
				group {
					id
					name
				}
			}
		}
	}
`;

export default ALL_COURSE;
