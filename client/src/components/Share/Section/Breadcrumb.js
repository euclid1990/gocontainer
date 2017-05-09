import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './Breadcrumb.css';

class Breadcrumb extends Component {

  onClick = (event) => {
    event.preventDefault();
    let value = event.currentTarget.getAttribute('href');
    if (value !== null) {
      this.props.history.push(value);
    }
  };

  render() {
    let items = this.props.items;
    return (
      <div>
      {typeof items !== "undefined" ?
        <ul className="breadcrumbs">
          {items.map((item, i) => (
          <li key={i} className="breadcrumb">
            {item.url !== '#' && item.url !== null ?
              <a href={item.url} onClick={this.onClick}>{item.name}</a>
              : item.name}
          </li>
          ))}
        </ul>
      : null}
      </div>
    );
  }
}

export default withRouter(Breadcrumb);
