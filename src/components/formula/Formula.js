import {ExcelComponent} from '@core/ExcelComponent';
import {$} from "@core/dom";

export class Formula extends ExcelComponent {
    static className = 'excel__formula'

    constructor($root, options) { //$root - это div с напиханными туда блоками из экземпляров классов
        super($root, {
            name: 'Formula',
            listeners: ['input','keydown'], //-!- keydown КРАСАВА!
            subscribe: ['currentText'],
            ...options
        })
    }

    toHTML() {
        return `
            <div class="info">fx</div>
            <div id="formula" class="input" contenteditable spellcheck="false"></div>
           `
    }

    init(){
        super.init();

        this.$formula = this.$root.find('#formula')
            //делаем, чтобы при переходе на ячейку КЛАВИШАМИ её содержимое показывалось бы в поле формулы:
        this.$on('table:select', $cell => {
            this.$formula.text($cell.data.value)
        })
            //делаем, чтобы изменении содержимого ячейки эти изменения синхронно происходили бы и в поле формулы
    }

    storeChanged({currentText}){
        this.$formula.text(currentText)
    }

    onInput(event) {
        const text = $(event.target).text() //------------------------!--------добавил из гитхаба
        this.$emit('formula:input', text)//$(event.target).text())           // $emit - из ЭксельКомпонент
    }

     onKeydown(event) {
        const keys = ['Enter','Tab']
        if(keys.includes(event.key) && !event.shiftKey) { // про !event.shiftkey - это я придумал, чтобы перенос текста делать
            event.preventDefault()
            this.$emit('formula:done') // у него - formula:done
        }
    }

}

