//----ДОБАВЛЯЕТ ВСЕ НЕОБХОДИМЫЕ СОБЫТИЯ==============

import {capitalize} from "@core/utils";

export class DomListener {
  constructor($root, listeners = []) {
    if(!$root) {
        throw new Error(`No $root provided for DomListener!`)
    }
    this.$root = $root;
    this.listeners = listeners;
}

    initDOMListeners() {
        //console.log(this.listeners); //выдаёт 4 массива, 3 пустых, у третьего ["input"]
        this.listeners.forEach(listener => {    //listener - например, input или click
            const method = getMethodName(listener)
            if(!this[method]) {                 // это если вдруг метод не определён
                const name = this.name || ''    //имя это приходит к нам из ExcelComponent
                throw new Error(
                    `Method ${method} is not implemented in ${name} Component`)
            }
            this[method] = this[method].bind(this)//это мы зафиксировали этот байнд, чтобы потом его можно было
                                                  // найти и удалить в removeDOMListeners
            //то же самое, что и addEventListener
            this.$root.on(listener, this[method]) //on тоже берётся из dom.js - там это addEventListener

        })
    }

    removeDOMListeners() { //из массива listeners убирать ненужный элемент??? я думаю
        this.listeners.forEach(listener => {
            const method = getMethodName(listener)
            this.$root.off(listener, this[method])   //off берётся из dom.js
        })
    }
}

//input => onInput
function getMethodName(eventName) {
    //return 'on'+capitalize(eventName)
    return `on${capitalize(eventName)}`
}

