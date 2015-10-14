import 'babel/polyfill';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import {Router} from 'react-router';
import ReactRouterRelay from 'react-router-relay';
import RelayLocalSchema from 'relay-local-schema';

import routes from './routes';
// Should the data dir be in app ala relay-todomvc?
import schema from '../server/data/schema';

Relay.injectNetworkLayer(
  new RelayLocalSchema.NetworkLayer({schema})
);

const history = createBrowserHistory({queryKey: false});

const mountNode = document.createElement('div');
document.body.appendChild(mountNode);

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
