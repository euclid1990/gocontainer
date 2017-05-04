import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import App from './components/App/App';
import reducer from './reducers';

import './index.css';

// Needed for onTouchTap
injectTapEventPlugin();

const middlewares = [ thunk ];
const store = createStore(reducer, applyMiddleware(...middlewares));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
