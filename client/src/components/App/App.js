import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import withWidth, { LARGE } from 'material-ui/utils/withWidth';
import { Header, Sidebar, Section, Footer } from '../Share';
import Routes from './Routes';
import api from './Api.json';
import './App.css';

const appBarHeight = 50;
const sidebarWidth = 256;
const footerDesktopHeight = 125;
const footerMobileHeight = 135;
const muiTheme = getMuiTheme({
  root: {
    // For fixed footer
    paddingBottom: footerDesktopHeight,
  },
  appBar: {
    position: 'fixed',
    height: appBarHeight,
    top: 0,
  },
  content: {},
  footer: {
    paddingLeft: 24,
    height: footerDesktopHeight,
  }
});

class App extends Component {

  constructor(props) {
    super(props);
    console.log(api)
    this.state = {
      sidebarOpen: false,
    };
  }

  handleTouchLeftHeaderIconButton = () => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
    });
  };

  handleChangeRequestSidebar = (open) => {
    this.setState({
      sidebarOpen: open,
    });
  };

  render() {
    let {
      sidebarOpen,
    } = this.state;
    let docked = false;

    if (this.props.width === LARGE) {
      docked = true;
      sidebarOpen = true;
      muiTheme.content.paddingLeft = muiTheme.footer.paddingLeft = sidebarWidth;
      muiTheme.root.paddingBottom = muiTheme.footer.height = footerDesktopHeight;
    } else {
      muiTheme.content.paddingLeft = 0;
      muiTheme.footer.paddingLeft = null;
      muiTheme.root.paddingBottom = muiTheme.footer.height = footerMobileHeight;
    }

    return (
      <Router>
        <MuiThemeProvider muiTheme={muiTheme}>
          {/* Create new Obj to prevent Warning: div was passed a style object that has previously been mutated. */}
          <div className="app" style={Object.assign({}, muiTheme.root)}>
            <Header
              style={muiTheme.appBar}
              onTouchLeftHeaderIconButton={this.handleTouchLeftHeaderIconButton}
            />
            <Sidebar
              style={muiTheme.navDrawer}
              docked={docked}
              onRequestChangeSidebar={this.handleChangeRequestSidebar}
              open={sidebarOpen}
            />
            <Section>
              <div className="content" style={Object.assign({}, muiTheme.content)}>
                <Routes />
              </div>
              <Footer style={muiTheme.footer} />
            </Section>
          </div>
        </MuiThemeProvider>
      </Router>
    );
  }
}

export default withWidth()(App);
