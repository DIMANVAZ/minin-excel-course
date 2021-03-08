// сама таблица создаётся ТУТ !!!
const CODES = {
    A:65,
    Z:90
}

function toCell(){
    return `
    <div class="cell" contenteditable></div>
    `
}

function toColumn(col){
        return`
        <div class="column">${col}</div>
        `
}
function createRow(index, content){
    return `
        <div class="row">
            <div class="row-info">${index ? index : ''}</div>
            <div class="row-data">${content}</div>
        </div>`
}

function toChar(_, index){
    return String.fromCharCode(CODES.A + index)
}

export function createTable(rowsCount = 15){        //rows - строки, cols - столбцы
    const colsCount = CODES.Z - CODES.A + 1 //1 плюсуем, чтобы Z тоже было
    const rows = []

    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)   // вот здесь и происходит заполнение буквами
        .map(toColumn) // было map((el) => { return createCol(el)}. -- И здесь происходит заполнение дивами с буквами
        .join('')      // здесь слияние массива (дивов с буквами) по горизонтали

    rows.push(createRow(null, cols)) // в массив строк вставили горизонт массив столбцов. А надо вставить ещё и остальные



    for (let i = 0; i < rowsCount; i++) {
        const cells = new Array(colsCount)
            .fill('')
            .map(toCell)
            .join('')

    rows.push(createRow(i+1, cells)) //Вставляем остальные строки (по факту - ячейки)
                                           // i+1 - чтобы ячейки нумеровались с 1, а не с 0
                                           // функция по умолчанию возвращает Undefined
    }

    return rows.join('') //по вертикали между собой строки поделены этим знаком из join
}