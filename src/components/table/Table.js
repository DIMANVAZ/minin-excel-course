import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from "@/components/table/table.template";
import {resizeHandler} from "@/components/table/table.resize";
import {shouldResize} from "@/components/table/table.functions";

// ресайз должен происходить по алгоритму: mousedown-mousemove-mouseup, ну т.е. реагировать на движения нажатой мыши

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root) {
        super($root, {
            listeners: ['mousedown']
        })
    }
    toHTML() {
        return  createTable(20)
    }

    onMousedown(event) { // event.target = элемент, вызывавший событие. Нажали на div - event.target = div
        // console.log(event.target.dataset)   // выдавал объекты - либо пустые, либо с ключом resize: row или col
        //--^^--это всё были проверялки ^^ на тему "что же такое  $el и event.target"

        if (shouldResize(event)) {      //если в атрибут data-resize что-то записано, то...
            resizeHandler(this.$root, event)
        }
    }
}