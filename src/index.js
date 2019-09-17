import React from 'react';
import ReactDOM from 'react-dom';
import 'react-app-polyfill/ie9';
import 'react-app-polyfill/ie11';
import './GetPolyfills.js';
import { createBrowserHistory } from 'history';
import JssProvider from 'react-jss/lib/JssProvider';
import {
    createGenerateClassName
} from '@material-ui/core/styles';
import {
    Router,
    Route,
    Switch
} from 'react-router-dom';

import 'assets/css/material-dashboard-react.css';

import indexRoutes from 'routes/index.jsx';

const generateClassName = createGenerateClassName({
    dangerouslyUseGlobalCSS: true,
    productionPrefix: 'c',
});

const hist = createBrowserHistory();

ReactDOM.render(
    <JssProvider generateClassName={generateClassName}>
    <Router history={hist}>
        <Switch>
            {
                indexRoutes.map((prop,key) => {
                    return (
                        <Route path={prop.path} component={prop.component}  key={key}/>
                    );
                })
            }
        </Switch>
    </Router>
    </JssProvider>
, document.getElementById('root'));
