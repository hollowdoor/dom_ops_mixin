import { insertAdjacent as insert } from 'dom-insert-adjacent';

export function domOpsMixin(proto){
    return Object.assign(proto, {
        insertAt(position, parent){
            insert(parent, position, this.element);
            return this;
        },
        insert(position, ...elements){
            insert(this.element, position, ...elements);
            return this;
        },
        appendTo(parent){
            return this.insertAt('beforeend', parent);
        },
        remove(element){
            if(element !== void 0){
                return this.element.removeChild(element);
            }
            let parent = this.element.parentNode;
            if(parent){
                return parent.removeChild(this.element);
            }
            return this.element;
        },
        append(...elements){
            return this.insert('beforeend', ...elements);
        },
        prepend(...elements){
            return this.insert('afterbegin', ...elements);
        },
        empty(){
            this.element.innerHTML = '';
            return this;
        },
        fill(...contents){
            return this.empty().append(...contents);
        }
    });
}
