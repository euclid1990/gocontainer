import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { getDockerStatsActionCreater } from '../../actions';
import { Circular } from '../../components/Share';

class DockerStatsComponent extends Component {

  componentWillMount() {
    this.props.initialize("");
  }

  render() {
    let {
      items,
      isFetching,
    } = this.props;
    return (
      <div>
        <p>List of container(s) resource usage statistics.</p>
        <Circular hide={isFetching && items.length === 0}/>
        {items.length ?
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
            {items.map((item, i) => (
              <TableRow key={i}>
                <TableRowColumn>{item.container_id}</TableRowColumn>
                <TableRowColumn>{item.container_name}</TableRowColumn>
                <TableRowColumn>{item.cpu_perc}</TableRowColumn>
                <TableRowColumn>{item.net_io}</TableRowColumn>
                <TableRowColumn>{item.block_io}</TableRowColumn>
                <TableRowColumn>{item.mem_perc}</TableRowColumn>
                <TableRowColumn>{item.mem_usage}</TableRowColumn>
                <TableRowColumn>{item.pids}</TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        : null}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    items: state.dockerStats.items,
    isFetching: state.dockerStats.isFetching,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    initialize: (filter) => {
      dispatch(getDockerStatsActionCreater(filter))
    }
  }
}

const DockerStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(DockerStatsComponent);

export default DockerStats;
