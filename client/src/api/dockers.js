import axios from 'axios';
import endpoint from './endpoint';
import route from './route';

const getDockerStats = (filter, cb) => {
  let uri = route(endpoint.docker.stats.path);
  axios.get(uri)
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
