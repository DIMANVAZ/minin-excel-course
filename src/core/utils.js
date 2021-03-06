//Pure functions - независимая функция, не взаимодействующая с глобальными переменными
// а берущая какие-то входные данные и выдающая результат
import {defaultStyles} from "@/constants";

export function capitalize(string) {
    if(typeof string !== 'string') {
        return ''
    }
    return string.charAt(0).toUpperCase() + string.slice(1)
}

export function range(start, end) {
    if (start > end) {
        [end, start] = [start, end]
    }

    return new Array(end - start +1)
        .fill('')
        .map((_, index) => start + index)
}

export function storage(key, data = null) { // функция для работы с LocalStorage - она одновременно и геттер, и сеттер
    if(!data) {
        return JSON.parse(localStorage.getItem(key))
    }
        localStorage.setItem(key, JSON.stringify(data))
}

export function isEqual(a, b){
    if (typeof a === 'object' && typeof b === 'object'){
        return JSON.stringify(a) === JSON.stringify(b)
    }
    return a === b
}

export function camelToDashCase(str){
    //return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
    return str.replace(/([A-Z])/g, g => `-${g[0].toLowerCase()}`)
}

export function toInlineStyles(styles = {}){
    return Object.keys(styles)
        .map(key => `${camelToDashCase(key)}: ${styles[key]}`)        //'font-weight: bold; text-decoration: underline;'
        .join(';')
}

export function debounce(fn, wait){ //функция для задержки (тут исп-ся для предотвращения слишком частых испусканий обновлений
    //например, при переименовании таблицы - чтобы обновлённый объект не улетал бы при каждой новой букве
    // и не делал таким образом сильную загрузку памяти и т.п.
    let timeout
    return function(...args) {
        const later = () => {
            clearTimeout(timeout)
            //eslint-disable-next-line
            fn.apply(this, args) //это для сохранения контекста - помним, что ()=>{} + THIS.   = ТОНКОСТИ
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

export function clone(obj) { //клонирует объект
    return JSON.parse(JSON.stringify(obj))
}

export function preventDefault(event) {
    event.preventDefault()
}