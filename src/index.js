import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {App} from "./App";
import {Home} from "./Home";
import {About} from "./About";

render((
    <Router history={browserHistory} component={App}>
        <Route path="/" component={Home} />
        <Route path="about" component={About}/>
    </Router>
), document.getElementById('app'));