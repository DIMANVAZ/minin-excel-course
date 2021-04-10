// сама таблица создаётся ТУТ !!!
import {parse} from "@core/parse"
import {toInlineStyles} from "@core/utils";
import {defaultStyles} from "@/constants";

const CODES = {
    A:65,
    Z:90
}

const DEFAULT_WIDTH = 120
const DEFAULT_HEIGHT = 24

function getWidth(state, index){ // возвращает значение ширины
    return (state[index] || DEFAULT_WIDTH) + 'px'
}

function getHeight(state, index){ // возвращает значение ширины
    return (state[index] || DEFAULT_HEIGHT) + 'px'
}

function toCell(state, row){   // создание ячейки с координатами в виде data-id №строки : №столбца
    return function(_, col){
        const id = `${row}:${col}`
        const width = getWidth(state.colState, col)
        const data = state.dataState[id]
        const styles = toInlineStyles({
             ...defaultStyles,
             ...state.stylesState[id]
         }) //--------------??------------------------
                //state здесь нормальный, но stylesState = {} пустой
                // соответственно, styles тоже пустой ПОКА
        return `
        <div
            class="cell"
            contenteditable
            data-col="${col}"
            data-type="cell"
            data-id="${id}"
            data-value="${data || ''}"
            style="${styles}; width: ${width}"
        >${parse(data) || ''}</div>
        `
    }
}

function toColumn({col, index, width}){ //   функция принимает значение в т.ч. индекс, так как функцию подставляют в .map()
        return`
        <div class="column" 
             data-type="resizeable" 
             data-col="${index}" 
             style="width: ${width}"
        >
            ${col}
            <div class="col-resize" data-resize="col"></div>
        </div>
        `
}
function createRow(index, content, state = {}){
    const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ''
    const height = getHeight(state, index)
    //^-вынесли в отдельную переменную, чтобы убрать синее подсвечивание у ячейки на перекрёстке 0:0
    return `
        <div 
            class="row" 
            data-type="resizeable" 
            data-row="${index}"
            style="height: ${height}"
        > 
            <div class="row-info">
                ${index ? index : ''}
                ${resize}
            </div>
            <div class="row-data">${content}</div>
        </div>`
}

function toChar(_, index){
    return String.fromCharCode(CODES.A + index)
}

function withWidthFrom(state) {
    return function (col, index) {
        return {
            col, index, width: getWidth(state.colState, index)
        }
    }
}

export function createTable(rowsCount = 15, state = {}){        //rows - строки, cols - столбцы
    //^^ state здесь  - объект c полями colState: {0: 177, 1: 303, 2: 156}, rowState, currentText, dataState
    const colsCount = CODES.Z - CODES.A + 1 //1 плюсуем, чтобы Z тоже было
    const rows = []

    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)   // вот здесь и происходит заполнение буквами
        .map(withWidthFrom(state)) // где-то здесь происходит заполнение дивами с буквами
        .map(toColumn)
        .join('')      // здесь слияние массива (дивов с буквами) по горизонтали

    rows.push(createRow(null, cols)) // в массив строк вставили горизонт массив столбцов. А надо вставить ещё и остальные
    //^^ это для первой строчки

    for (let row = 0; row < rowsCount; row++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCell(state, row))
            .join('')

    rows.push(createRow(row + 1, cells, state.rowState)) //Вставляем остальные строки (по факту - ячейки)
                                           // i+1 - чтобы ячейки нумеровались с 1, а не с 0
                                           // функция по умолчанию возвращает Undefined
    }

    return rows.join('') //по вертикали между собой строки поделены этим знаком из join
}