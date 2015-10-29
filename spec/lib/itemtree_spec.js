import * as itemtree from 'lib/itemtree';

it("sanitiy spec", function() {
    expect(true).toBe(true);
});

function reduce(state, reducer, actions) {
    return actions.reduce(function(state, action) {
        return reducer(state, action);
    }, state);
}

describe("tree addition", () => {
    describe("insert before", () => {
        it ("creates a new tree if state is null", () => {
            let i = itemtree.reducer(null, itemtree.tree$insert$start({ item: 'first' }));
            let r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(1);
            expect(r.children[0].item).toBe('first');
        });

        it ("inserts at the beginning of the root with no id", () => {
            var i = itemtree.reducer(null, itemtree.tree$insert$start({ item: "first" })),
                i = itemtree.reducer(i, itemtree.tree$insert$start({ item: "zeroth" })),
                r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(2);
            expect(r.children[0].item).toBe("zeroth");
        });

        it ("inserts at the beginning of the node with the given id", () => {
            var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "parent" })),
                id = i.getIn(["children", 0, "id"]),
                i  = itemtree.reducer(i, itemtree.tree$insert$start({ id, item: "child" })),
                r  = i.toJS();

            expect(r.children.length).toBe(1);
            expect(r.children[0].children.length).toBe(1);
            expect(r.children[0].children[0].item).toBe("child");
        });
    });

    describe("insert after", () => {
        it ("creates a new tree if one wasn't given", () => {
            var i = itemtree.reducer(null, itemtree.tree$insert$end({ item: "first" })),
                r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(1);
            expect(r.children[0].item).toBe("first");
        });

        it ("inserts at the end of the given item's children", () => {
            var i = itemtree.reducer(null, itemtree.tree$insert$end({ item: "first" })),
                i = itemtree.reducer(i, itemtree.tree$insert$end({ item: "second" })),
                r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(2);
            expect(r.children[1].item).toBe("second");
        });

        it ("inserts at the beginning of the node with the given id", () => {
            var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "parent" })),
                id = i.getIn(["children", 0, "id"]),
                i  = itemtree.reducer(i, itemtree.tree$insert$start({ id, item: "child.1" })),
                i  = itemtree.reducer(i, itemtree.tree$insert$start({ id, item: "child.0" })),
                i  = itemtree.reducer(i, itemtree.tree$insert$end({ id, item: "child.2" })),
                r  = i.toJS();

            expect(r.children.length).toBe(1);
            expect(r.children[0].children.length).toBe(3);
            expect(r.children[0].children[0].item).toBe("child.0");
            expect(r.children[0].children[2].item).toBe("child.2");
        });
    });

    describe("insert before", () => {
        it("inserts before the given item in the parent", () => {
            var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "second" })),
                id = i.getIn(["children", 0, "id"]),
                i = itemtree.reducer(i, itemtree.tree$insert$before({ id, item: "first" })),
                r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(2);
            expect(r.children[0].item).toBe("first");
        });
    });

    describe("insert after", () => {
        it("inserts after the given item in the parent", () => {
            var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "first" })),
                id = i.getIn(["children", 0, "id"]),
                i = itemtree.reducer(i, itemtree.tree$insert$after({ id, item: "second" })),
                r = i.toJS();

            expect(r.children).toBeDefined();
            expect(r.children.length).toBe(2);
            expect(r.children[0].item).toBe("first");
        });
    });
});

describe("tree misc", () => {
    it("can remove a node by id", () => {
        var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "first" })),
            id = i.getIn(["children", 0, "id"]),
            i  = itemtree.reducer(i, itemtree.tree$delete({id})),
            r  = i.toJS();

        expect(r.children).toBeDefined();
        expect(r.children.length).toBe(0);
    });

    it("can swap a value out at a given id", () => {
        var i  = itemtree.reducer(null, itemtree.tree$insert$start({ item: "orig" })),
            id = i.getIn(["children", 0, "id"]),
            i  = itemtree.reducer(i, itemtree.tree$swap({id, item: "swap"})),
            r  = i.toJS();

        expect(r.children).toBeDefined();
        expect(r.children.length).toBe(1);
        expect(r.children[0].item).toBe("swap");
    });

    it("can merge an object into the item at a given id", () => {
        var p  = {foo: "foo"},
            i  = itemtree.reducer(null, itemtree.tree$insert$start({item: p})),
            id = i.getIn(["children", 0, "id"]),
            i  = itemtree.reducer(i, itemtree.tree$merge({id, item: {bar: "bar"}})),
            r  = i.toJS();

        expect(r.children).toBeDefined();
        expect(r.children.length).toBe(1);
        expect(Object.keys(r.children[0].item).length).toBe(2);
        expect(r.children[0].item.foo).toBe("foo");
        expect(r.children[0].item.bar).toBe("bar");
    });
});
