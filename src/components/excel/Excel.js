import {$} from "@core/dom";
import {Emitter} from "@core/Emitter";
import {StoreSubscriber} from "@core/StoreSubscriber";
import {updateDate} from "@/redux/actions";
import {preventDefault} from "@core/utils"; //импортнули и дальше будем ей пользоваться

export class Excel {
    constructor(options) {
    //this.$el = $(selector); //внизу в рендере в него пихается $root ! !! ! ! !
    this.components = options.components || []
    this.store = options.store
    this.emitter = new Emitter(); //тут он хотя бы существует
    this.subscriber = new StoreSubscriber(this.store)
}
    getRoot() {
        const $root = $.create('div','excel') //====вот он, $root!!!

        const componentOptions = {
            emitter: this.emitter,
            store: this.store
        }

        this.components = this.components.map(Component => {      //с большой буквы, потому что каждый элемент массива - это класс
            const $el = $.create('div', Component.className) // это "$root", который как 1й аргумент пойдёт в конструктор ExcelComponent
            const component = new Component($el, componentOptions);   //создаётся новый экземпляр класса (Header/Formula/Toolbar/...)+ опции
            $el.html(component.toHTML())
            $root.append($el)
                // здесь $el - это div с классом Header, Table, Formula, Toolbar
            return component
        })

        return $root; //возвращает div класса Excel с напиханными в него $el
    }

    init() {  //---ОТРИСОВАТЬ---------
        if (process.env.NODE_ENV === 'production') {
            document.addEventListener('contextmenu', preventDefault)
        }
        this.store.dispatch(updateDate())
        this.subscriber.subscribeComponents(this.components)
        this.components.forEach(component => component.init()) //init() идёт из ExcelComponent
        document.removeEventListener('contextmenu', preventDefault)

            //здесь $el - div с id="app" и в него мы пихаем $root (div.excel)
    /*  const node = document.createElement('h1') // - это был второй вариант
        node.textContent = 'Какой-то текст';
        this.$el.append(node);                  */
    }

    destroy(){  //---УНИЧТОЖИТЬ ????!---------
        this.subscriber.unsubscribeFromStore()
        this.components.forEach(component => component.destroy());
    }
}
