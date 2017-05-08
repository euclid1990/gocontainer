import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import withWidth, { LARGE, MEDIUM, SMALL } from 'material-ui/utils/withWidth';
import { Header, Sidebar, Section, Footer } from '../Share';
import Routes from './Routes';
import './App.css';

const appBarHeight = 50;
const sidebarWidth = 256;
const footerDesktopHeight = 140;
const footerMobileHeight = 150;
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
    this.prevWidth = null
    this.state = {
      sidebarOpen: false,
      docked: false,
    };
  }

  handleTouchLeftHeaderIconButton = () => {
    this.setState({
      sidebarOpen: !this.state.sidebarOpen,
      docked: this.props.width === LARGE,
    });
    this.handleChangeWidth(!this.state.sidebarOpen, this.props.width);
  };

  handleChangeRequestSidebar = (open) => {
    this.setState({
      sidebarOpen: open,
      docked: this.props.width === LARGE,
    });
    this.handleChangeWidth(open, this.props.width);
  };

  handleChangeWidth = (open, screen) => {
    switch(open) {
      case true:
        if (screen === LARGE) {
          muiTheme.content.paddingLeft = muiTheme.footer.paddingLeft = sidebarWidth;
          muiTheme.root.paddingBottom = footerDesktopHeight;
          muiTheme.footer.height = footerDesktopHeight - 16;
        } else {
          muiTheme.content.paddingLeft = 0;
          muiTheme.footer.paddingLeft = null;
          muiTheme.root.paddingBottom = footerMobileHeight;
          muiTheme.footer.height = footerMobileHeight - 16;
        }
        break;
      default:
          muiTheme.content.paddingLeft = 0;
          muiTheme.footer.paddingLeft = null;
          muiTheme.root.paddingBottom = footerMobileHeight;
          muiTheme.footer.height = footerMobileHeight - 16;
    }
  }

  render() {
    let {
      sidebarOpen,
      docked,
    } = this.state;

    if (this.props.width === LARGE && this.prevWidth !== LARGE) {
      docked = true;
      sidebarOpen = true;
      this.prevWidth = LARGE;
      this.handleChangeWidth(sidebarOpen, LARGE);
    } else if ((this.props.width === MEDIUM || this.props.width === SMALL) && this.prevWidth !== MEDIUM) {
      this.handleChangeWidth(sidebarOpen, MEDIUM);
      console.log(this.props.width)
      console.log(MEDIUM)
      this.prevWidth = MEDIUM;
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
