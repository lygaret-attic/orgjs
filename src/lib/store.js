import { createStore } from 'redux';
import { combineReducers } from 'redux';

import { itemtree } from 'lib/itemtree';

export default createStore(
    combineReducers({
        current: itemtree
    })
);
