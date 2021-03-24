// сама таблица создаётся ТУТ !!!
const CODES = {
    A:65,
    Z:90
}

//function toCell(row, col){        //возвращает ячейку
//    return `
//    <div class="cell" contenteditable data-col="${col}" data-row="${row}"></div>
//    `
//}

function toCell(row){   // создание ячейки с координатами в виде data-id №строки : №столбца
    return function(_, col){
        return `
        <div
            class="cell"
            contenteditable
            data-col="${col}"
            data-type="cell"
            data-id="${row}:${col}"
        ></div>
        `
    }
}

function toColumn(col, index){ //   функция принимает значение в т.ч. индекс, так как функцию подставляют в .map()
        return`
        <div class="column" data-type="resizeable" data-col="${index}">
            ${col}
            <div class="col-resize" data-resize="col"></div>
        </div>
        `
}
function createRow(index, content){
    const resize = index ? '<div class="row-resize" data-resize="row"></div>' : ''
    //^-вынесли в отдельную переменную, чтобы убрать синее подсвечивание у ячейки на перекрёстке 0:0
    return `
        <div class="row" data-type="resizeable"> 
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

export function createTable(rowsCount = 15){        //rows - строки, cols - столбцы
    const colsCount = CODES.Z - CODES.A + 1 //1 плюсуем, чтобы Z тоже было
    const rows = []

    const cols = new Array(colsCount)
        .fill('')
        .map(toChar)   // вот здесь и происходит заполнение буквами
        .map(toColumn) // было map((el) => { return createCol(el)}. -- И здесь происходит заполнение дивами с буквами
        .join('')      // здесь слияние массива (дивов с буквами) по горизонтали

    rows.push(createRow(null, cols)) // в массив строк вставили горизонт массив столбцов. А надо вставить ещё и остальные

    for (let row = 0; row < rowsCount; row++) {
        const cells = new Array(colsCount)
            .fill('')
            //.map((_, col) => toCell(row, col))
            .map(toCell(row))
            .join('')

    rows.push(createRow(row + 1, cells)) //Вставляем остальные строки (по факту - ячейки)
                                           // i+1 - чтобы ячейки нумеровались с 1, а не с 0
                                           // функция по умолчанию возвращает Undefined
    }

    return rows.join('') //по вертикали между собой строки поделены этим знаком из join
}