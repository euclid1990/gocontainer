import * as dockerApi from '../api/dockers';
import { DOCKER_STATS_GET } from '../constants/DockerActionTypes';

export const getDockerStats = (dockerStats) => ({
  'type': DOCKER_STATS_GET,
  dockerStats
});

export const getDockerStatsActionCreater = () => {
  return (dispatch) => {
    return dockerApi.getDockerStats((ds) => {
      dispatch(getDockerStats(ds));
    });
  };
}

