import {setContext} from "@apollo/client/link/context";
import {ApolloClient, createHttpLink, from, InMemoryCache} from "@apollo/client";
import {updateAccessToken} from "../api/api";
import {onError} from "@apollo/client/link/error";

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('access_token');
    console.log(`Token: ${token}`)
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


const onErrorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            console.log(`Err: ${err}`)
            if (err.extensions) {
                console.log(err.extensions.code)
                switch (err.extensions.code) {
                    // Apollo Server sets code to UNAUTHENTICATED
                    // when an AuthenticationError is thrown in a resolver
                    case "UNAUTHENTICATED":
                        // Modify the operation context with a new token
                        const newAccessToken = updateAccessToken();
                        console.log(`New access token: ${newAccessToken}`)
                        const oldHeaders = operation.getContext().headers;
                        operation.setContext({
                            headers: {
                                ...oldHeaders,
                                authorization: `Bearer ${newAccessToken}`
                            },
                        });
                        // Retry the request, returning the new observable
                        return forward(operation);
                }
            }
        }
    }


    // To retry on network errors, we recommend the RetryLink
    // instead of the onError link. This just logs the error.
    if (networkError) {
        console.log(`[Network error]: ${networkError}`);
    }
});

export const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: from([onErrorLink, authLink, httpLink])
});


//
// let array = [1, 2, 3]
// console.log(array[array.length - 1])