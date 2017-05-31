import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
// import Router from 'react-router-dom/BrowserRouter';
// import Route from 'react-router-dom/Route';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();
import Home from './home';


const App = () => (
    <div>
        <Router history={ history }>
            <Route path='/home' component={ Home }>
            </Route>
        </Router>
    </div>
);

ReactDOM.render(<App />, document.getElementById('root'));
