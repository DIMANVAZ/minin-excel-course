import {$} from "@core/dom";
import {Emitter} from "@core/Emitter"; //импортнули и дальше будем ей пользоваться

export class Excel {
    constructor(selector, options) {
    this.$el = $(selector);
    this.components = options.components || []
    this.emitter = new Emitter(); //тут он хотя бы существует
}
    getRoot() {
        const $root = $.create('div','excel') //====вот он, $root!!!

        const componentOptions = {   //-------!-!-!-!-!--иметь в виду, здесь подстава с обёрткой emitter в componentOptions
            emitter: this.emitter
        }

        this.components = this.components.map(Component => {      //с большой буквы, потому что каждый элемент массива - это класс
            const $el = $.create('div', Component.className)
            const component = new Component($el, {componentOptions});   //создаётся новый экземпляр класса + опции ?? для эмиттера
            $el.html(component.toHTML())
            $root.append($el)
            return component
        })

        return $root; //возвращает div с напиханными туда блоками из экземпляров классов
    }

    render() {  //---ОТРИСОВАТЬ---------
        this.$el.append(this.getRoot())
        this.components.forEach(component => component.init()) //init() идёт из ExcelComponent

    /*  const node = document.createElement('h1') // - это был второй вариант
        node.textContent = 'Какой-то текст';
        this.$el.append(node);                  */
    }

    destroy(){  //---УНИЧТОЖИТЬ ????!---------
        this.components.forEach(component => component.destroy());
    }
}
