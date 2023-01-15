import {
	ApolloClient,
	createHttpLink,
	from,
	InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { RetryLink } from '@apollo/client/link/retry';
import { updateAccessToken } from '../api/api';

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('access_token');
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const httpLink = createHttpLink({
	uri: 'http://localhost:5500/graphql',
	credentials: 'include',
});

const retryLink = new RetryLink({
	delay: {
		initial: 300,
		max: Infinity,
		jitter: true,
	},
	attempts: {
		max: 5,
		retryIf: async (error) => {
			console.log(error);
			if (
				error.message === 'Response not successful: Received status code 401'
			) {
				console.log(error.message);
				await updateAccessToken();
				return true;
			}
			return false;
		},
	},
});

export const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: from([retryLink, authLink, httpLink]),
	connectToDevTools: true,
	defaultOptions: {
		watchQuery: {
			fetchPolicy: 'cache-and-network',
		},
	},
});
