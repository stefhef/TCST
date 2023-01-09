import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {Provider} from "react-redux";
import {store} from "./store";
import 'focus-visible/dist/focus-visible';
import {ApolloClient, ApolloProvider, createHttpLink, InMemoryCache} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";




const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('access_token');
    // return the headers to the context so httpLink can read them
    console.log(`Token: ${token}`)
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});


const httpLink = createHttpLink({
    uri: 'http://localhost:5500/v2/auth',
    credentials: 'include'
});

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
});

ReactDOM.render(
    <Provider store={store}>
        <ApolloProvider client={client}>
            <React.StrictMode>
                <App/>
            </React.StrictMode>
        </ApolloProvider>
    </Provider>,
    document.getElementById('root')
);
