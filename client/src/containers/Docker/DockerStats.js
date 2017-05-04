import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { getDockerStatsActionCreater } from '../../actions';

class DockerStatsComponent extends Component {

  componentWillMount() {
    this.props.initialize();
  }

  render() {
    let dockerStats = this.props.dockerStats;
    return (
      <div>
        <p>List of container(s) resource usage statistics.</p>
        <Table>
          <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
            <TableRow>
              <TableHeaderColumn>CONTAINER</TableHeaderColumn>
              <TableHeaderColumn>NAME</TableHeaderColumn>
              <TableHeaderColumn>CPU %</TableHeaderColumn>
              <TableHeaderColumn>NET I/O</TableHeaderColumn>
              <TableHeaderColumn>BLOCK I/O</TableHeaderColumn>
              <TableHeaderColumn>MEM %</TableHeaderColumn>
              <TableHeaderColumn>MEM USAGE / LIMIT</TableHeaderColumn>
              <TableHeaderColumn>PIDS</TableHeaderColumn>
          </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {dockerStats.map((stats, i) => (
              <TableRow key={i}>
                <TableRowColumn>{stats.container_id}</TableRowColumn>
                <TableRowColumn>{stats.container_name}</TableRowColumn>
                <TableRowColumn>{stats.cpu_perc}</TableRowColumn>
                <TableRowColumn>{stats.net_io}</TableRowColumn>
                <TableRowColumn>{stats.block_io}</TableRowColumn>
                <TableRowColumn>{stats.mem_perc}</TableRowColumn>
                <TableRowColumn>{stats.mem_usage}</TableRowColumn>
                <TableRowColumn>{stats.pids}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    dockerStats: state.dockerStats,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initialize: () => {
      dispatch(getDockerStatsActionCreater())
    }
  }
}

const DockerStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(DockerStatsComponent);

export default DockerStats;
