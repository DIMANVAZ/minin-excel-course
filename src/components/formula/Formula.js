import {ExcelComponent} from '@core/ExcelComponent';
import {$} from "@core/dom";

export class Formula extends ExcelComponent {
    static className = 'excel__formula'

    constructor($root, options) { //$root - это div с напиханными туда блоками из экземпляров классов
        super($root, {
            name: 'Formula',
            listeners: ['input','keydown'], //-!- keydown КРАСАВА!
            ...options
        })
    }

    toHTML() {
        return `<div class="info">fx</div>
            <div id="formula" class="input" contenteditable spellcheck="false"></div>`;
    }

    init(){
        super.init();

        this.$formula = this.$root.find('#formula')
            //делаем, чтобы при переходе на ячейку КЛАВИШАМИ её содержимое показывалось бы в поле формулы:
        this.$on('table:select', $cell => {
            this.$formula.text($cell.text());
        })
            //делаем, чтобы изменении содержимого ячейки эти изменения синхронно происходили бы и в поле формулы
        this.$on('table:input', $cell => {
            this.$formula.text($cell.text());
        })
    }

    onInput(event) {
        this.$emit('formula:input', $(event.target).text())           // $emit - из ЭксельКомпонент
    }

     onKeydown(event) {          //---!---КРАСАВА
        const keys = ['Enter','Tab']
        if(keys.includes(event.key) && !event.shiftKey) { // про !event.shiftkey - это я придумал, чтобы перенос текста делать
            event.preventDefault()
            this.$emit('formula:Enter') // у него - formula:done
        }
    }

}

