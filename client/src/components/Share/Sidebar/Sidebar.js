import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import { zIndex} from 'material-ui/styles';
import './Sidebar.css'

const SelectableList = makeSelectable(List);

class Sidebar extends Component {

  handleChangeList = (event, value) => {
    this.props.history.push(value);
  };

  handleTouchTapHeader = () => {
    this.props.onRequestChangeSidebar(false);
  };

  render() {
    const {
      location,
      docked,
      onRequestChangeSidebar,
      open,
      style,
    } = this.props;

    return (
      <Drawer
        style={style}
        docked={docked}
        open={open}
        onRequestChange={onRequestChangeSidebar}
        containerStyle={{zIndex: zIndex.drawer - 100}}
        className="sidebar"
      >
        <div className="logo" onTouchTap={this.handleTouchTapHeader}>Go Container</div>
        <SelectableList
          value={location.pathname}
          onChange={this.handleChangeList}
        >
          <ListItem key="1"
            primaryText="Get Started"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="Home" value="/" />,
              <ListItem key="2" primaryText="About" value="/about" />,
            ]}
          />
          <ListItem key="1"
            primaryText="Get Started1"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="Home1" value="/1" />,
              <ListItem key="2" primaryText="About1" value="/about1" />,
            ]}
          />
        </SelectableList>
      </Drawer>
    );
  }
}

export default withRouter(Sidebar);
