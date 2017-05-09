import axios from 'axios';
import endpoint from './endpoint';
import route from './route';
import { DOCKER_STATS_FILTER_ALL } from '../constants/DockerActionTypes';

const getDockerStats = (filter, cb) => {
  let uri = route(endpoint.docker.stats.path);
  axios.get(uri, {
      params: {
        all: filter === DOCKER_STATS_FILTER_ALL,
      }
    })
    .then(function (response) {
      if (response.status === 200) {
        cb(response.data);
      } else {
        cb([]);
      }
    })
    .catch(function (error) {
      cb([]);
    });
}

export {
  getDockerStats
}
