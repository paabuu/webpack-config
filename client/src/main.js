import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Match } from 'react-router';
// import Router from 'react-router-dom/BrowserRouter';
// import Route from 'react-router-dom/Route';
import createBrowserHistory from 'history/createBrowserHistory';
const history = createBrowserHistory();
import Todo from './todo';

const Home = () => (
    <p>this is my homepage!</p>
)


const App = () => (
    <Router history={ history }>
        <Route path="/todo" component={ Todo }></Route>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
