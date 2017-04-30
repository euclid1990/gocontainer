import React, {Component} from 'react';
import ClearFix from 'material-ui/internal/ClearFix';
import spacing from 'material-ui/styles/spacing';
import withWidth, {SMALL, MEDIUM, LARGE} from 'material-ui/utils/withWidth';

const desktopGutter = spacing.desktopGutter, desktopGutterLess = spacing.desktopGutterLess;

class Section extends Component {

  getStyles() {
    return {
      root: {},
      content: {
        maxWidth: 1200,
        margin: '0 auto',
      },
      rootWhenSmall: {
        paddingTop: desktopGutter * 2,
        paddingLeft: desktopGutterLess,
        paddingRight: desktopGutterLess,
      },
      rootWhenLarge: {
        paddingTop: desktopGutter * 2.25,
        paddingLeft: desktopGutterLess,
        paddingRight: desktopGutterLess,
      },
    };
  }

  render() {
    const {
      style,
      width,
      ...other
    } = this.props;
    const styles = this.getStyles();
    let content = this.props.children;

    return (
      <ClearFix
        {...other}
        style={Object.assign(
          styles.root,
          style,
          width === SMALL && styles.rootWhenSmall,
          (width === LARGE || width === MEDIUM) && styles.rootWhenLarge)}
      >
        {content}
      </ClearFix>
    );
  }
}

export default withWidth()(Section);
