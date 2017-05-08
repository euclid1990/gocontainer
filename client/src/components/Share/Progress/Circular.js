import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress'

const styles = {
  circular: {
    display: 'block',
    margin: 'auto',
  },
};

class CircularComponent extends Component {

  render() {
    let hide = this.props.hide;
    return (
      <div>
        {hide ? <CircularProgress color="#FF9800" style={styles.circular} /> : null}
      </div>
    );
  }
}

export default CircularComponent;
