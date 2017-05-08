import * as dockerApi from '../api/dockers';
import { DOCKER_STATS_GET, DOCKER_STATS_GET_COMPLETE } from '../constants/DockerActionTypes';

const getDockerStats = (filter) => ({
  'type': DOCKER_STATS_GET,
  filter,
});

export const getDockerStatsComplete = (filter, dockerStats) => ({
  'type': DOCKER_STATS_GET_COMPLETE,
  filter,
  dockerStats,
});

export const getDockerStatsActionCreater = (filter) => {
  return (dispatch) => {
    dispatch(getDockerStats(filter))
    return dockerApi.getDockerStats(filter, (ds) => {
      dispatch(getDockerStatsComplete(filter, ds));
    });
  };
}

