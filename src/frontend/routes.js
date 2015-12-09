import React from 'react';
import {IndexRoute, Route} from 'react-router';

import ViewerQueries from './queries/ViewerQueries';
import BoardQueries from './queries/BoardQueries';

import Main from './components/Main';
import BoardList from './components/BoardList';
import Board from './components/Board';

export default (
  <Route
    path="/"
    component={Main}
    queries={ViewerQueries}
  >
    <IndexRoute
      component={BoardList}
      queries={ViewerQueries}
      prepareParams={() => ({status: 'any'})}
    />
    <Route
      path="board/:boardId"
      component={Board}
      queries={BoardQueries}
    />
    <Route
      path=":status"
      component={BoardList}
      queries={ViewerQueries}
    />
  </Route>
);
