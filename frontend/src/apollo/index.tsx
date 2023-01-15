import {setContext} from "@apollo/client/link/context";
import {ApolloClient, createHttpLink, from, InMemoryCache} from "@apollo/client";
import {updateAccessToken} from "../api/api";
import {RetryLink} from "@apollo/client/link/retry";

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('access_token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const httpLink = createHttpLink({
    uri: 'http://localhost:5500/graphql',
    credentials: 'include'
});


const retryLink = new RetryLink({
    delay: {
        initial: 300,
        max: Infinity,
        jitter: true,
    },
    attempts: {
        max: 5,
        retryIf: async (error, _operation) => {
            console.log(error)
            if (error.message === "Response not successful: Received status code 401") {
                console.log(error.message)
                await updateAccessToken()
                return true
            }
            return false
        }
    }});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([retryLink, authLink, httpLink]),
    defaultOptions: {
        watchQuery: {
            fetchPolicy: 'cache-and-network'
        }
    },
});