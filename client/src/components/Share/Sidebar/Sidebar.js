import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import { ListItem } from 'material-ui/List';
import { zIndex} from 'material-ui/styles';
import './Sidebar.css'

class Sidebar extends Component {

  handleTouchTapHeader = () => {
    this.props.onRequestChangeSidebar(false);
  };

  render() {
    const {
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
        <ListItem key="1"
          primaryText="Get Started"
          primaryTogglesNestedList={true}
          nestedItems={[
            <ListItem key="1" primaryText="Required Knowledge" value="/get-started/required-knowledge" />,
            <ListItem key="2" primaryText="Installation" value="/get-started/installation" />,
            <ListItem key="3" primaryText="Usage" value="/get-started/usage" />,
            <ListItem key="4" primaryText="Server Rendering" value="/get-started/server-rendering" />,
            <ListItem key="5" primaryText="Examples" value="/get-started/examples" />,
          ]}
        />
      </Drawer>
    );
  }
}

export default Sidebar;
