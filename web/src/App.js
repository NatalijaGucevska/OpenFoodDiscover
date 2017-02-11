import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'

export function App({ children, location }) {
    return (
        <div id="app-app">

        <ReactCSSTransitionGroup
          component="div"
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {React.cloneElement(children, {
            key: location.pathname
          })}
        </ReactCSSTransitionGroup>

        </div>
     );
}
