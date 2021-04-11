import {storage} from "@core/utils";

export function toHTML(key){
    const model = storage(key)
    const id = key.split(":")[1]//длина списка ключей ---МОЁ :)------------
    //const date = new Date(parseInt(id)) //распарсенье даты + мудрёж с таблицей
    return `
         <li class="db__record">
             <a href="#excel/${id}">${model.title}</a>
             <strong>
                   ${new Date(model.openedDate).toLocaleDateString()}
                   ${new Date(model.openedDate).toLocaleTimeString()}
             </strong>
         </li>
    `
}
// excel:123232 - пример паттерна в локалСторедж
// excel:334343 - пример другого паттерна
function getAllKeys(){      //задача функции - получить из ЛокалСторедж только те функции, которые соответствуют паттерну выше
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if(!key.includes('excel')){
            continue
        }
    keys.push(key)
    }
            console.log('keys = ', keys)
    return keys
}

export function createRecordsTable(){
    const keys = getAllKeys()

    if(!keys.length) {
        return `<p> Вы пока не создали ни одной таблицы </p>`
    }

    return `
        <div class="db__list-header">
                <span>Название</span>
                <span>Дата открытия</span>
            </div>

            <ul class="db__list">
               ${keys.map(toHTML).join('')}
            </ul>
    `
}