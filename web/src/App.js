import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { browserHistory, Router, Route, IndexRoute, Link } from 'react-router'

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentCardIndex : 0
    }
  }
  render() {
    const { children, location, propositions } = this.props;
    const { currentCardIndex } = this.state;

    return (
        <div id="app-app">

        <ReactCSSTransitionGroup
          component="div"
          transitionName="example"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={500}
        >
          {React.cloneElement(children, {
            key: location.pathname,
            propositions: propositions,
            currentCardIndex,
            onSwipeCard: () => { console.log("salut"); this.setState({ currentCardIndex: currentCardIndex + 1  }) }
          })}
        </ReactCSSTransitionGroup>

        </div>
     );
  }
}
