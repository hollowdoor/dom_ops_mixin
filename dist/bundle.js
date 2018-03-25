'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var domInsertAdjacent = require('dom-insert-adjacent');

function domOpsMixin(proto){
    return Object.assign(proto, {
        insertAt: function insertAt(position, parent){
            domInsertAdjacent.insertAdjacent(parent, position, this.element);
            return this;
        },
        insert: function insert$1(position){
            var elements = [], len = arguments.length - 1;
            while ( len-- > 0 ) elements[ len ] = arguments[ len + 1 ];

            domInsertAdjacent.insertAdjacent.apply(void 0, [ this.element, position ].concat( elements ));
            return this;
        },
        appendTo: function appendTo(parent){
            return this.insertAt('beforeend', parent);
        },
        remove: function remove(element){
            if(element === void 0){
                return this.element.removeChild(element);
            }
            var parent = this.element.parentNode;
            if(parent){
                return parent.removeChild(this.element);
            }
            return this.element;
        },
        append: function append(){
            var elements = [], len = arguments.length;
            while ( len-- ) elements[ len ] = arguments[ len ];

            return (ref = this).insert.apply(ref, [ 'beforeend' ].concat( elements ));
            var ref;
        },
        prepend: function prepend(){
            var elements = [], len = arguments.length;
            while ( len-- ) elements[ len ] = arguments[ len ];

            return (ref = this).insert.apply(ref, [ 'afterbegin' ].concat( elements ));
            var ref;
        },
        empty: function empty(){
            this.element.innerHTML = '';
            return this;
        },
        fill: function fill(){
            var contents = [], len = arguments.length;
            while ( len-- ) contents[ len ] = arguments[ len ];

            return (ref = this.empty()).append.apply(ref, contents);
            var ref;
        }
    });
}

exports.domOpsMixin = domOpsMixin;
//# sourceMappingURL=bundle.js.map
