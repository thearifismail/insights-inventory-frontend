import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { init } from './store';
import App from './App';
import logger from 'redux-logger';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

const AppEntry = () => (
    <Provider store={init(logger).getStore()}>
        <Router basename={getBaseName(window.location.pathname)}>
            <App />
        </Router>
    </Provider>
);

export default AppEntry;
