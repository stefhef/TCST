import React, {FunctionComponent} from 'react';
import {BrowserRouter} from "react-router-dom";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme";
import AppRouter from "./components/AppRouter";
import {MainHeader} from "./components/layouts/MainHeader";
import {ApolloClient, ApolloProvider, InMemoryCache, gql, useQuery} from "@apollo/client";
import {BaseSpinner} from "./components/BaseSpinner";



const App: FunctionComponent = () => {
  const GET_COURSE = gql`
      query {
          courses(groupId: 1)
      }
  `
    const { loading, error, data } = useQuery(GET_COURSE)
    if (loading) {
        return <BaseSpinner />
    }
    console.log(`Data: ${data}`)
    console.log(`Error: ${error}`)
    return (
        <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                <BrowserRouter>
                    {/*<MainHeader/>*/}
                    <h1>
                        Data: {data.courses}
                    </h1>
                    {/*<AppRouter/>*/}
                </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
