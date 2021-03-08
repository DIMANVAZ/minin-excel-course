import {ExcelComponent} from '@core/ExcelComponent';

export class Formula extends ExcelComponent {
    static className = 'excel__formula'

    constructor($root) { //$root - это div с напиханными туда блоками из экземпляров классов
        super($root, {
            name: 'Formula',
            listeners: ['input','click']
        })
    }

    toHTML() {
        return `<div class="info">fx</div>
            <div class="input" contenteditable spellcheck="false"></div>`;
    }

    onInput(event) {                //---вааапрос! зачем ему делать в другом месте ОНКЛИК из КЛИК, если
                                    // если ОНКЛИК уже тут прописан ?!!!?
        console.log(this.$root)
        console.log("Formula: onInput", event.target.textContent.trim());
    }

    onClick(event) {
        console.log('mk');
    }
}

