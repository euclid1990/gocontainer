import { combineReducers } from 'redux';
import { dockerStats } from './dockers';

const goContainerApp = combineReducers({
  dockerStats
});

export default goContainerApp;
