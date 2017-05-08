import { DOCKER_STATS_GET, DOCKER_STATS_GET_COMPLETE } from '../constants/DockerActionTypes';

const dockerStats = (state = { isFetching: false, items: [] }, action) => {
  switch(action.type) {
    case DOCKER_STATS_GET:
      return Object.assign({}, state, {
        isFetching: true,
        items: [],
      });
    case DOCKER_STATS_GET_COMPLETE:
      return Object.assign({}, state, {
        isFetching: false,
        items: action.dockerStats,
      });
    default:
      return state;
  }
}

export {
  dockerStats
};
