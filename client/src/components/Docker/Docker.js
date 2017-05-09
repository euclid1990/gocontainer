import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { Breadcrumb } from '../Share';

class Docker extends Component {

  constructor(props) {
    super(props);
    this.breadcrumbs = [{ name: 'Docker' }];
    this.state = {
      breadcrumbs: this.breadcrumbs,
    };
  }

  updateBreadcrumb = (item) => {
    this.setState({
      breadcrumbs: [ ...this.breadcrumbs, item]
    });
  }

  render() {
    const routes = this.props.routes
    return (
      <div>
        <Breadcrumb items={this.state.breadcrumbs} />
        {routes.map((route, index) => (
          <Route key={index} path={route.path} exact={route.exact} render={props => (
            // Passing props to children components
            <route.component {...props} updateBreadcrumb={this.updateBreadcrumb} />
          )}/>
        ))}
      </div>
    );
  }
}

export default Docker;
