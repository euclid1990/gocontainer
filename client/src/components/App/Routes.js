import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { About, Home, Docker, DockerStats } from '../index';

const routes = [
  { path: '/',
    exact: true,
    component: Home,
  },
  { path: '/about',
    component: About,
  },
  {
    path: '/dockers',
    component: Docker,
    routes: [
      { path: '/dockers/stats',
        component: DockerStats,
      },
    ],
  }
];

// wrap <Route> and use this everywhere instead, then when
// sub routes are added to any route it'll work
const RouteWithSubRoutes = (route) => (
  <Route path={route.path} exact={route.exact} render={props => (
    // pass the sub-routes down to keep nesting
    <route.component {...props} routes={route.routes}/>
  )}/>
)

class Routes extends Component {

  render() {
    return (
      <div>
        {routes.map((route, i) => (
          <RouteWithSubRoutes key={i} {...route}/>
        ))}
      </div>
    );
  }
}

export default Routes;
