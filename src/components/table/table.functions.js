import {range} from "@core/utils";

export function shouldResize(event){
    return event.target.dataset.resize
}

export function isCell (event){
    return event.target.dataset.type === "cell"
}

export function matrix($target, $current){
    const target = $target.id(true)     //айдишник целевой ячейки
    const current = $current.id(true)   //айдишник текущей выделенной ячейки
    const cols = range(current.col, target.col)
    const rows = range(current.row, target.row)

    return cols.reduce((acc,col) => {
        rows.forEach(row => acc.push(`${row}:${col}`))
        return acc
    }, [])
}

export function nextSelector(key, {col, row}){
    const MIN_VALUE = 0     //для проверок, чтобы не уходить в минусА
    switch(key) {
        case 'Enter':
        case 'ArrowDown':
            row++
            break
        case 'Tab':
        case 'ArrowRight':
            col++
            break
        case 'ArrowLeft':
            col > MIN_VALUE ? col-- : col
            break
        case 'ArrowUp':
            row > MIN_VALUE ? row-- : row
            break
    }
    return `[data-id="${row}:${col}"]`
}