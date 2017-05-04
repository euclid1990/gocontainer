import docker_stats from './docker_stats.json'

const TIME_OUT = 1000

const getDockerStats = (callback) => {
  return setTimeout(() => {
    callback(docker_stats)
  }, TIME_OUT)
}

export {
  getDockerStats
}
