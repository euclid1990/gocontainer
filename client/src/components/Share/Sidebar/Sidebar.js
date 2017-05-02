import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import { zIndex } from 'material-ui/styles';
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
          <ListItem key="1" primaryText="Home" value="/" />
          <ListItem key="2"
            primaryText="Docker"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="Stats" value="/dockers/stats" />,
              <ListItem key="2" primaryText="Search" value="/dockers/search" />,
              <ListItem key="3" primaryText="Start/Stop" value="/dockers/start" />,
            ]}
          />
          <ListItem key="3"
            primaryText="Container"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="List" value="/containers" />,
              <ListItem key="2" primaryText="Create" value="/containers/create" />,
            ]}
          />
          <ListItem key="4"
            primaryText="Image"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="List" value="/images" />,
              <ListItem key="2" primaryText="Pull" value="/images/pull" />,
              <ListItem key="3" primaryText="Build" value="/images/create" />,
            ]}
          />
          <ListItem key="5"
            primaryText="Network"
            primaryTogglesNestedList={true}
            nestedItems={[
              <ListItem key="1" primaryText="List" value="/networks" />,
              <ListItem key="2" primaryText="Create" value="/networks/create" />,
              <ListItem key="3" primaryText="Connect" value="/networks/connect" />,
            ]}
          />
        </SelectableList>
      </Drawer>
    );
  }
}

export default withRouter(Sidebar);
