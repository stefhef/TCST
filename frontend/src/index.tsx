import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';
import 'focus-visible/dist/focus-visible';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo';

ReactDOM.render(
	<Provider store={store}>
		<ApolloProvider client={client}>
			<React.StrictMode>
				<App />
			</React.StrictMode>
		</ApolloProvider>
	</Provider>,
	document.getElementById('root')
);
