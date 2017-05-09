import { combineReducers } from 'redux';
import {
  DOCKER_STATS_GET,
  DOCKER_STATS_GET_COMPLETE,
  DOCKER_STATS_FILTER,
  DOCKER_STATS_FILTER_ALL
} from '../constants/DockerActionTypes';

const dockerStatsFilter = (state = DOCKER_STATS_FILTER_ALL, action) => {
  switch (action.type) {
    case DOCKER_STATS_FILTER:
      return action.filter;
    default:
      return state;
  }
}

const dockerStatsList = (state = { isFetching: false, items: [] }, action) => {
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

const dockerStats = combineReducers({
  dockerStatsFilter,
  dockerStatsList
})

export {
  dockerStats
};
