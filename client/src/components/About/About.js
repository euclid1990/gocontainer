import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import AppBar from 'material-ui/AppBar';
import './About.css';

const muiTheme = getMuiTheme({
  appBar: {
    height: 50,
  },
});

class About extends Component {

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <AppBar title="Go Container" />
          <span>bbbb</span>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default About;
