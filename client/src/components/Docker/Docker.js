import React, { Component } from 'react';
import { Route } from 'react-router-dom';

class Docker extends Component {

  render() {
    const routes = this.props.routes
    return (
      <div>
        <p><strong>Docker</strong></p>
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

export default Docker;
