import React, {FunctionComponent} from 'react';
import {BrowserRouter} from "react-router-dom";
import {ChakraProvider, ColorModeScript} from "@chakra-ui/react";
import theme from "./theme";
import {MainHeader, AppRouter} from "./components";



const App: FunctionComponent = () => {
    return (
        <ChakraProvider theme={theme}>
                <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
                <BrowserRouter>
                    <MainHeader/>
                    <AppRouter/>
                </BrowserRouter>
        </ChakraProvider>
    );
}

export default App;
