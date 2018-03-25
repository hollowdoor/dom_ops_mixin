var domOpsMixin = (function (exports) {
'use strict';

function isElement(o){
    var type = typeof Element; //HTMLElement maybe
    return (
    type === "object" || type === 'function'
    ? o instanceof Element
    //DOM2
    : !!o
        && typeof o === "object"
        && o.nodeType === 1 //Definitely an Element
        && typeof o.nodeName==="string"
    );
}

function getElement(element, context){
    if ( context === void 0 ) { context = document; }

    if(typeof element === 'string'){
        try{
            return context.querySelector(element);
        }catch(e){ throw e; }
    }

    if(isElement(element)) { return element; }

    if(!!element && typeof element === 'object'){
        if(isElement(element.element)){
            return element.element;
        }else if(isElement(element[0])){
            return element[0];
        }
    }

    throw new TypeError(("value (" + element + ") in isElement(value)\n    is not an element, valid css selector,\n    or object with an element property, or index 0."));

}

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

//Supposedly faster for v8 than just Object.create(null)
function Raw(){}
Raw.prototype = (function (){
    //Maybe some old browser has risen from it's grave
    if(typeof Object.create !== 'function'){
        var temp = new Object();
        temp.__proto__ = null;
        return temp;
    }

    return Object.create(null);
})();

function rawObject(){
    var arguments$1 = arguments;

    var objects = [], len = arguments.length;
    while ( len-- ) { objects[ len ] = arguments$1[ len ]; }

    var raw = new Raw();
    objectAssign.apply(void 0, [ raw ].concat( objects ));
    return raw;
}

var insertAdjacentElement = (function (){
    var div = document.createElement('div');
    if(div.insertAdjacentElement){
        div = null;
        return function (d, p, v){ return d.insertAdjacentElement(p, v); };
    }
    div = null;

    var ops = rawObject({
        beforebegin: function beforebegin(d, v){
             d.parentNode.insertBefore(v, d);
        },
        afterbegin: function afterbegin(d, v){
            d.insertBefore(v, d.firstChild);
        },
        beforeend: function beforeend(d, v){
            d.appendChild(v);
        },
        afterend: function afterend(d, v){
            d.parentNode.insertBefore(v, d.nextSibling);
        }
    });

    return function (d, p, v){
        if(!ops[p]){
            throw new Error(p + ' is not a valid operation for insertAdjacent');
        }
        ops[p](d, v);
    };

})();

function insert(dest, position, value){
    if(isElement(value)){
        return insertAdjacentElement(dest, position, value);
    }
    dest.insertAdjacentHTML(position, value + '');
}

function insertInFragment(dest, position, values){
    var div = document.createElement('div'), c;
    div.appendChild(dest);
    values.forEach(function (value){
        insert(div, position, value);
        while(c = div.firstChild){
            dest.appendChild(c);
        }
    });
}

function insertAll(dest, position, values){
    if(dest.nodeType === Node.DOCUMENT_FRAGMENT_NODE){
        return insertInFragment(dest, position, values);
    }
    dest = getElement(dest);
    values.forEach(function (value){
        insert(dest, position, value);
    });
}

function insertAdjacent(dest, position){
    var arguments$1 = arguments;

    var values = [], len = arguments.length - 2;
    while ( len-- > 0 ) { values[ len ] = arguments$1[ len + 2 ]; }

    return insertAll(dest, position, values);
}

function domOpsMixin(proto){
    return Object.assign(proto, {
        insertAt: function insertAt(position, parent){
            insertAdjacent(parent, position, this.element);
            return this;
        },
        insert: function insert$1(position){
            var elements = [], len = arguments.length - 1;
            while ( len-- > 0 ) elements[ len ] = arguments[ len + 1 ];

            insertAdjacent.apply(void 0, [ this.element, position ].concat( elements ));
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

return exports;

}({}));
//# sourceMappingURL=dom-ops-mixin.js.map
