import 'babel/polyfill';

import React from 'react';
import h from 'react-hyperscript';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { combineReducers } from 'redux';

import App   from 'app';
import store from 'lib/store';

const domRoot   = document.getElementById('root');
const reactRoot = h(Provider, {store},[h(App)]);

render(reactRoot, domRoot);
