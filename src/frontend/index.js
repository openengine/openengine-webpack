import 'babel/polyfill';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Router} from 'react-router';
import ReactRouterRelay from 'react-router-relay';

import styles from "./assets/styles/engine.css";

import routes from './routes';

Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('http://localhost:1337/graphql', {
    headers: {
      Authorization: 'Bearer cal_token',
    },
  })
);

const history = createBrowserHistory({queryKey: false});

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

ReactDOM.render(
  <Router
    createElement={ReactRouterRelay.createElement}
    history={history}
    routes={routes}
  />,
  mountNode
);

// Needed for dev console
window.React = React;
