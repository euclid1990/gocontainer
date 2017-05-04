import { DOCKER_STATS_GET } from '../constants/DockerActionTypes';

const dockerStats = (state = [], action) => {
  switch(action.type) {
    case DOCKER_STATS_GET:
      return [
        ...action.dockerStats,
      ];
    default:
      return state;
  }
}

export {
  dockerStats
};
