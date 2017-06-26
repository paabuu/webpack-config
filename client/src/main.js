import React, { Component } from 'react';
import ReactDOM from 'react-dom';
// import { Router, Route, Switch } from 'react-router';
// import Router from 'react-router-dom/BrowserRouter';
// import Route from 'react-router-dom/Route';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();

import Todo from './Todo';
import Home from './Home';
import Music from './Music';
import Regist from './Regist';

import './common.scss';


const App = () => (
    <Router history={ history }>
        <div>
            <Route path="/todo" component={ Todo }></Route>
            <Route path="/music" component={ Music }></Route>
            <Route path="/regist" component={ Regist }></Route>
            <Route exact path="/" component={ Home }></Route>
        </div>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
