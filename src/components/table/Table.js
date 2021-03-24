import {ExcelComponent} from '@core/ExcelComponent';
import {createTable} from "@/components/table/table.template";
import {resizeHandler} from "@/components/table/table.resize";
import {isCell, matrix, nextSelector, shouldResize} from "@/components/table/table.functions";
import {TableSelection} from "@/components/table/TableSelection";
import {$} from "@core/dom";

// ресайз должен происходить по алгоритму: mousedown-mousemove-mouseup, ну т.е. реагировать на движения нажатой мыши

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown','keydown','input'], //---------!----------- добавил keydown )))))
            ...options
        })
    }
    toHTML() {
        return  createTable(20)
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init(){         // это из класса ExcelComponent  - сокращённый initDomListeners
        //если не напишем super, то он перезатрёт основной ("родительский?") инит и ресайза не будет
        super.init()
        const $cell = this.$root.find('[data-id="0:0"]') // так мы выделили первую ячейку,
 //$cell - это Объект класса ДОМ {$el:div.cell.selected}
        this.selectCell($cell)  //это чтобы значение ячейки 0:0 было сразу в формуле при загрузке страницы

        this.$on('formula:input', text => {        // метод $on  - тоже из ЭксельКомпонент
            this.selection.current.text(text)
            console.log('Fuck VM  ' + text)
        })

        this.$on('formula:Enter', ()=>{     //--!-КРАСАВА-
            //console.log('Enter catched by Table')
            this.selection.current.focus()
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
    }

    onMousedown(event) { // event.target = элемент, вызывавший событие. Нажали на div - event.target = div
            //let selected = $(event.target) //-- моя неплохая реализация выделения ячейки
            //this.selection.deselect()
            //this.selection.select(selected);

        if (shouldResize(event)) {      //если в атрибут data-resize что-то записано, то...
            resizeHandler(this.$root, event)
        } else if(isCell(event)){    //проверяем, что это именно ячейка
            const $target = $(event.target) //оборачиваем в $, чтобы это стало объектом класса ДОм
            if (event.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map(id => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selection.select($target)
            }
        }
    }

     onKeydown(event) {
        const keys = [
            'Enter',
            'Tab',
            'ArrowLeft',
            'ArrowRight',
            'ArrowDown',
            'ArrowUp'
        ]

        const {key} = event    //key = event.key

         if(keys.includes(key) && !event.shiftKey) {
             event.preventDefault();
             const id = this.selection.current.id(true)
             const $next = this.$root.find(nextSelector(key, id))
             this.selectCell($next)
         }
                        //let rowX = +this.selection.current.id()[0];
                        //let colX = +this.selection.current.id()[2];
     }

     onInput(event) {
        this.$emit('table:input', $(event.target))
     }
}
