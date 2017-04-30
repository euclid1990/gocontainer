import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { About, Home } from '../index';

const routes = [
  { path: '/',
    exact: true,
    component: Home,
  },
  { path: '/about',
    component: About,
  }
];

class Routes extends Component {

  render() {
    return (
      <div>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            component={route.component}
          />
        ))}
      </div>
    );
  }
}

export default Routes;
