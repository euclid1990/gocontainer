import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';

class Header extends Component {

  render() {
    const {
      style,
      onTouchLeftHeaderIconButton,
    } = this.props;

    return (
      <AppBar
        style={{position: style.position}}
        onLeftIconButtonTouchTap={onTouchLeftHeaderIconButton}
        title="Go Container"
        iconClassNameRight="fa fa-cog"
        zDepth={0}
      />
    );
  }
}

export default Header;
