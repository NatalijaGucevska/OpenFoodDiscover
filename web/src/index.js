import React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import {App} from "./App";
import {StartLogo} from "./StartLogo";
import {StartTry} from "./StartTry";
import {StartWelcome} from "./StartWelcome";
import {Home} from "./Home";
import {About} from "./About";
import {Like} from "./Like";
import {DontLike} from "./DontLike";
import {SeeYou} from "./SeeYou";

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

render((
    <Router history={browserHistory}>
        <Route path="/" component={App}>
          <IndexRoute component={StartLogo} />
          <Route path="starttry" component={StartTry}/>
          <Route path="startwelcome" component={StartWelcome}/>
          <Route path="home" component={Home}/>
          <Route path="about" component={About}/>
          <Route path="like" component={Like}/>
          <Route path="dontlike" component={DontLike}/>
          <Route path="seeyou" component={SeeYou}/>
        </Route>
    </Router>
), document.getElementById('app'));
