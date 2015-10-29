import Immutable from 'immutable';
import TreeUtils from 'immutable-treeutils';
import { createAction, handleActions } from 'redux-actions';

const root = new Immutable.Seq();
const tree = new TreeUtils(root, 'id', 'children');

export const tree$insert$start    = createAction('tree$insert$start', ({id, item}) => ({id, item}));
export const tree$insert$end      = createAction('tree$insert$end', ({id, item}) => ({id, item}));
export const tree$insert$before   = createAction('tree$insert$before', ({id, item}) => ({id, item}));
export const tree$insert$after    = createAction('tree$insert$after', ({id, item}) => ({id, item}));
export const tree$insert          = tree$insert$start;

export const tree$delete          = createAction('tree$delete', ({id}) => ({id}));
export const tree$merge           = createAction('tree$merge', ({id, item}) => ({id, item}));
export const tree$swap            = createAction('tree$swap', ({id, item}) => ({id, item}));

export const tree$move$up         = createAction('tree$move$up', ({id}) => ({id}));
export const tree$move$down       = createAction('tree$move$down', ({id}) => ({id}));
export const tree$move$promote    = createAction('tree$move$out', ({id, children=true}) => ({id, children}));
export const tree$move$demote     = createAction('tree$move$in', ({id, children=true}) => ({id, children}));

function genid() {
    return '_' + (Date.now() + Math.random()).toString(36).substr(2, 9);
}

function gennode(item) {
    return Immutable.Map({item: item, id: genid(), children: Immutable.List()});
}

export function reducer(state, action) {
    if (state == null) {
        state = Immutable.fromJS({ id: '__root', children: [] });
    }

    switch(action.type) {
    case 'tree$insert$start'  : return _insert$start(state, action);
    case 'tree$insert$end'    : return _insert$end(state, action);
    case 'tree$insert$before' : return _insert$before(state, action);
    case 'tree$insert$after'  : return _insert$after(state, action);
    case 'tree$delete'        : return _delete(state, action);
    case 'tree$merge'         : return _merge(state, action);
    case 'tree$swap'          : return _swap(state, action);
    case 'tree$move$up'       : return _move$up(state, action);
    case 'tree$move$down'     : return _move$down(state, action);
    case 'tree$move$promote'  : return _move$promote(state, action);
    case 'tree$move$demote'   : return _move$demote(state, action);

    default:
        return state;
    }
}

function _insert$start(state, action) {
    let {id='__root', item} = action.payload;
    let node = gennode(item),
        path = tree.byId(state, id);

    return state.updateIn(path.concat('children'),
                          c => c.splice(0, 0, node));
}

function _insert$end(state, action) {
    let {id='__root', item} = action.payload;
    let node = gennode(item),
        path = tree.byId(state, id);

    return state.updateIn(path.concat('children'),
                          c => c.push(node));
}

function _insert$before(state, action) {
    let {id, item} = action.payload,
        node       = gennode(item),
        path       = tree.byId(state, id),
        index      = tree.childIndex(state, id),
        parent     = tree.parent(state, path);

    return state.updateIn(parent.concat('children'),
                          c => c.splice(index, 0, node));
}

function _insert$after(state, action) {
    let {id, item} = action.payload,
        node       = gennode(item),
        path       = tree.byId(state, id),
        index      = tree.childIndex(state, id),
        parent     = tree.parent(state, path);

    return state.updateIn(parent.concat('children'),
                          c => c.splice(index + 1, 0, node));
}

function _delete(state, action) {
    let {id, item} = action.payload,
        path       = tree.byId(state, id),
        index      = tree.childIndex(state, id),
        parent     = tree.parent(state, path);

    return state.updateIn(parent.concat('children'),
                          c => c.splice(index, 1));
}

function _merge(state, action) {
    let {id, item} = action.payload,
        path = tree.byId(state, id);

    return state.updateIn(path.concat('item'),
                          n => ({...n, ...item}));
}

function _swap(state, action) {
    let {id, item} = action.payload,
        path = tree.byId(state, id);

    return state.updateIn(path, n => ({...n, item}));
}

function _move$up(state, action) {
    return state;
}

function _move$down(state, action) {
    return state;
}

function _move$promote(state, action) {
    return state;
}

function _move$demote(state, action) {
    return state;
}
