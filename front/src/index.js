import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from "react-router-dom";

import App from './App';
import * as serviceWorker from './serviceWorker';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import 'status-indicator/styles.css';

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById('root'));

serviceWorker.unregister();
