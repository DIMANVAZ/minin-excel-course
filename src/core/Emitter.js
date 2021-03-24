 export class Emitter{
    constructor() {
        this.listeners = {}
    }

    // dispatch, fire, trigger - синонимы - уведомляем слушателей, ЕСЛИ ОНИ ЕСТЬ
    // table.emit('table:select',{a:1})
    emit(event, ...args) { //eventName = например, 'focus' или 'formula:done'
        if (!Array.isArray(this.listeners[event])) {
            return false
        }
        this.listeners[event].forEach(listener => {
            listener(...args)
        })
        return true
    }

    //on, listen и  т.д. - подписываемся на уведомления
    //добавляем нового слушателя
    //formula.subscribe('table.select', ()=> {})
    subscribe(event, fn){
        this.listeners[event] = this.listeners[event] || []
        this.listeners[event].push(fn)
        return ()=> { //отписка от определённого типа событий - удаляем из массива слушателя
            this.listeners[event] =
                this.listeners[event].filter(listener => listener !== fn)
        }
    }
}

// //проверка работы эмиттера и подписчика
// const emitter = new Emitter()
// emitter.subscribe('vladilen', data => console.log('sub:', data))            //--подписка
// emitter.emit('vladilen', 43) // 43 - это и есть data, которая в subscribe   //--эмиттер
//
// const unsub = emitter.subscribe('vladilen', data => console.log('sub:', data))
//  // ^^ получаем функцию для отписки, но по факту ещё и одну подписку
// unsub()     //--запускаем её и отписываемся

