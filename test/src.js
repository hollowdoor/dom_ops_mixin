import { domOpsMixin } from '../';

class List {
    constructor(){
        this.element = document.createElement('ol');
    }
}

domOpsMixin(List.prototype);

let list = new List().appendTo(document.body);

list.append('<li>Item 1</li>');
list.append('<li>Item 2</li>');

setTimeout(()=>{
    list.fill(`<li>Fill 1</li><li>Fill 2</li>`);
}, 3000);
