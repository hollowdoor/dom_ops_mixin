dom-ops-mixin
===

Install
---

`npm install dom-ops-mixin`

Usage
---

```javascript
import { domOpsMixin } from 'dom-ops-mixin';

class List {
    constructor(){
        //The mixin methods require an
        //element property.
        this.element = document.createElement('ol');
    }
}

domOpsMixin(List.prototype);

let list = new List().appendTo(document.body);

list.append('<li>Item 1</li>');
list.append('<li>Item 2</li>');
```

Operations given to the receiving prototype
------------

`this.element` refers to the element on the current instance that this mixin is given to by using `domOpsMixin(ClassName.prototype)`.

`elements`, and `element` arguments on any of these methods can be:

* DOM elements
* An HTML string

The `position` argument on any of these methods is the same as [insertAdjacentHTML](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentHTML), and [insertAdjacentElement](https://developer.mozilla.org/en-US/docs/Web/API/Element/insertAdjacentElement):


* 'beforebegin': Before the element itself.
* 'afterbegin': Just inside the element, before its first child.
* 'beforeend': Just inside the element, after its last child.
* 'afterend': After the element itself.


### proto.insertAt(position, element)

Insert `this.element` at the `position` in the `parent` which must be a DOM element.

### proto.insert(position, ...elements)

Insert some `elements` at the `position` in the `this.element`.

### proto.appendTo(parent)

Append `this.element` to the `parent` which must be a DOM element.

The `proto.appendTo()` method is comparable to this method on other libraries that do DOM operations.

### proto.remove(element|undefined)

Pass an element to `remove()` to remove it from `this.element`, or pass `undefined` to remove `this.element` from it's parent.

`proto.remove()` returns the removed element.

### proto.append(...elements)

Append the `elements` to `this.element`.

### proto.prepend(...elements)

Adds the `elements` at the beginning of `this.element`.

About
---

This is a simple **mixin** that gives a prototype some DOM operations on a `this.element` instance property value.

Also see
----

[dom mixins](https://www.npmjs.com/search?q=dom%20mixin)
