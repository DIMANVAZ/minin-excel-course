import {$} from "@core/dom"; //импортнули и дальше будем ей пользоваться

export class Excel {
    constructor(selector, options) {
    this.$el = $(selector);
    this.components = options.components || []
}

    getRoot() {
        const $root = $.create('div','excel') //====вот он, $root!!!

        this.components = this.components.map(Component => {      //с большой буквы, потому что каждый элемент массива - это класс
            const $el = $.create('div', Component.className)
            const component = new Component($el);      //создаётся новый экземпляр класса
            $el.html(component.toHTML())
            $root.append($el)
            return component
        })

        return $root; //возвращает div с напиханными туда блоками из экземпляров классов
    }

    render() {
        this.$el.append(this.getRoot())

        this.components.forEach(component => component.init())

    /*  const node = document.createElement('h1') // - это был второй вариант
        node.textContent = 'Какой-то текст';
        this.$el.append(node);                  */

    }
}