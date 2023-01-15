import React, {FunctionComponent} from 'react';
import {
    Routes,
    Route,
} from "react-router-dom";
import {privateRoutes, publicRoutes} from "../routes";
import {useTypedSelector} from "../hooks";

export const AppRouter: FunctionComponent = () => {
    const {isAuth} = useTypedSelector(state => state.auth)
    return (
        isAuth
            ?
            <Routes>
                {privateRoutes.map(route => <Route {...route}/>)}
            </Routes>
            :
            <Routes>
                {publicRoutes.map(route => <Route {...route} />)}
            </Routes>
    );
};
