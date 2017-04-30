import React, { Component } from 'react';
import ClearFix from 'material-ui/internal/ClearFix';
import IconButton from 'material-ui/IconButton';
import { darkWhite } from 'material-ui/styles/colors';
import './Footer.css';

class Footer extends Component {

  getStyles() {
    return {
      iconButton: {
        color: darkWhite,
      },
    };
  }

  render() {
    const {
      style,
      ...other
    } = this.props;
    const styles = this.getStyles();

    return (
      <ClearFix
        {...other}
        style={Object.assign({}, style)}
        className="footer"
      >
        <p>
            {'Hand crafted with love by '}
            <a href="https://github.com/euclid1990">
              euclid1990
            </a>
            {' and our awesome '}
            <a href="https://github.com/euclid1990/gocontainer/graphs/contributors">
              contributors
            </a>.
          </p>
          <IconButton
            iconStyle={styles.iconButton}
            iconClassName="fa fa-github" aria-hidden="true"
            href="https://github.com/euclid1990/gocontainer"
          />
      </ClearFix>
    );
  }
}

export default Footer;
