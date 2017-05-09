import * as dockerApi from '../api/dockers';
import { DOCKER_STATS_GET, DOCKER_STATS_GET_COMPLETE, DOCKER_STATS_FILTER } from '../constants/DockerActionTypes';

export const filterContainer = (filter) => ({
  'type': DOCKER_STATS_FILTER,
  filter
});

const getDockerStats = (filter) => ({
  'type': DOCKER_STATS_GET,
  filter,
});

export const getDockerStatsComplete = (filter, dockerStats) => ({
  'type': DOCKER_STATS_GET_COMPLETE,
  filter,
  dockerStats,
});

export const getDockerStatsActionCreator = (filter) => {
  return (dispatch) => {
    dispatch(getDockerStats(filter))
    return dockerApi.getDockerStats(filter, (ds) => {
      dispatch(getDockerStatsComplete(filter, ds));
    });
  };
}

