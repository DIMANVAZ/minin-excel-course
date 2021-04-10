import {ExcelComponent} from '@core/ExcelComponent';
import {$} from "@core/dom";
import {createTable} from "@/components/table/table.template";
import {resizeHandler} from "@/components/table/table.resize";
import {isCell, matrix, nextSelector, shouldResize} from "@/components/table/table.functions";
import {TableSelection} from "@/components/table/TableSelection";
import * as actions from '@/redux/actions'
import {defaultStyles} from "@/constants";
import {parse} from "@core/parse"
//import {applyStyle} from "@/redux/actions";

// ресайз должен происходить по алгоритму: mousedown-mousemove-mouseup, ну т.е. реагировать на движения нажатой мыши

export class Table extends ExcelComponent {
    static className = 'excel__table'

    constructor($root, options) {
        super($root, {
            name: 'Table',
            listeners: ['mousedown','keydown','input'],
            ...options
        })
    }
    toHTML() {
        return  createTable(20, this.store.getState())
    }

    prepare() {
        this.selection = new TableSelection()
    }

    init(){         // это из класса ExcelComponent  - сокращённый initDomListeners
        //если не напишем super, то он перезатрёт основной ("родительский?") инит и ресайза не будет
        super.init()

        this.selectCell(this.$root.find('[data-id="0:0"]'))
        /*так мы выделили первую ячейку,
            this.$root.find('[data-id="0:0"]') - это Объект класса ДОМ {$el:div.cell.selected}
         это чтобы значение ячейки 0:0 было сразу в формуле при загрузке страницы
         */

        this.$on('formula:input', value => {        // метод $on  - тоже из ЭксельКомпонент
            this.selection.current
                .attr('data-value', value)
                .text(parse(value))
            this.updateTextInStore(value)
        })

        this.$on('formula:done', ()=>{
            this.selection.current.focus()
        })

        this.$on('toolbar:applyStyle', value =>{
            this.selection.applyStyle(value)
                this.$dispatch(actions.applyStyle({
                value,
                ids: this.selection.selectedIds
            }))
        })
    }

    selectCell($cell) {
        this.selection.select($cell)
        this.$emit('table:select', $cell)
        const styles = $cell.getStyles(Object.keys(defaultStyles))
            console.log('Styles to dispatch', styles)
        this.$dispatch(actions.changeStyles(styles))
    }

    async resizeTable(event) {
        try{
            const data = await resizeHandler(this.$root, event) // data = VALUE, который выдаёт resizeHandler (импортированный)
            this.$dispatch(actions.tableResize(data)) // выпинываем в пространство событие и данные к нему(объект Action)
        } catch(e){
            console.warn('resize error', e.message)
        }
    }

    onMousedown(event) { // event.target = элемент, вызывавший событие. Нажали на div - event.target = div
        if (shouldResize(event)) {      //если в атрибут data-resize что-то записано, то...
            this.resizeTable(event)
        } else if(isCell(event)){    //проверяем, что это именно ячейка
            const $target = $(event.target) //оборачиваем в $, чтобы это стало объектом класса ДОм
            if (event.shiftKey) {
                const $cells = matrix($target, this.selection.current)
                    .map(id => this.$root.find(`[data-id="${id}"]`))
                this.selection.selectGroup($cells)
            } else {
                this.selectCell($target)
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

     updateTextInStore(value) {
         this.$dispatch(actions.changeText({
             id: this.selection.current.id(),
             value
         }))
     }
     onInput(event) {
        this.updateTextInStore($(event.target).text())
     }
}
