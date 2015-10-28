import React from 'react';
import {IndexRoute, Route} from 'react-router';

import ViewerQueries from './queries/ViewerQueries';
import BoardQueries from './queries/BoardQueries';
import CardQueries from './queries/CardQueries';

import Main from './components/Main';
import BoardList from './components/BoardList';
import Board from './components/Board';
import FullCard from './components/FullCard';

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
      path="card/:cardId"
      component={FullCard}
      queries={CardQueries}
    />
    <Route
      path=":status"
      component={BoardList}
      queries={ViewerQueries}
    /> 
  </Route>
);
