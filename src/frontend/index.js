import 'babel-polyfill';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {RelayRouter} from 'react-router-relay';
import routes from './routes';
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer(process.env.GRAPHQL_SERVER, {
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
  <RelayRouter history={history}
    history={history}
    routes={routes}
  />,
  mountNode
);

// Needed for dev console
window.React = React;
