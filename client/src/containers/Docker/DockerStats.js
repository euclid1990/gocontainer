import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import { DOCKER_STATS_FILTER_ALL, DOCKER_STATS_FILTER_RUNNING } from '../../constants/DockerActionTypes';
import { filterContainer, getDockerStatsActionCreator } from '../../actions';
import { Circular } from '../../components/Share';

class DockerStatsComponent extends Component {

  componentWillMount() {
    this.props.initialize();
  }

  render() {
    let {
      filter,
      selectFilter,
      items,
      isFetching,
    } = this.props;
    return (
      <div>
        <p>List of container(s) resource usage statistics.</p>
        <DropDownMenu
          value={filter}
          onChange={selectFilter}
          style={{width: 200}}
          autoWidth={false}>
          <MenuItem value={DOCKER_STATS_FILTER_ALL} primaryText="All containers" />
          <MenuItem value={DOCKER_STATS_FILTER_RUNNING} primaryText="Running containers" />
        </DropDownMenu>
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
  let dockerStatsFilter = state.dockerStats.dockerStatsFilter,
      dockerStatsList = state.dockerStats.dockerStatsList;
  return {
    filter: dockerStatsFilter,
    items: dockerStatsList.items,
    isFetching: dockerStatsList.isFetching,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    selectFilter: (event, index, value) => {
      dispatch(filterContainer(value));
      dispatch(getDockerStatsActionCreator(value));
    },
    initialize: () => {
      dispatch(getDockerStatsActionCreator(DOCKER_STATS_FILTER_ALL));
      ownProps.updateBreadcrumb({
        name: 'Statistics',
      })
    },
  }
}

const DockerStats = connect(
  mapStateToProps,
  mapDispatchToProps
)(DockerStatsComponent);

export default DockerStats;
