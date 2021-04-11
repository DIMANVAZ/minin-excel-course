import {isEqual} from "@core/utils";
// идея в том, чтобы было "одно окно"(один поток) изменений из UI в STORE (a не 4, как раньше)
export class StoreSubscriber{
    constructor(store) {
        this.store = store
        this.sub = null
        this.prevState = {}
    }

    subscribeComponents(components) {
        this.prevState = this.store.getState()      //сохранили предыдущее состояние программы, записав его
        this.sub = this.store.subscribe(state => {
            Object.keys(state).forEach(key => {
                if(!isEqual(this.prevState[key], state[key])) {
                                                //если нынешнее и сохранённое(прежнее) состояния не равны,
                                                // то есть если что-то изменилось, то
                    components.forEach(component => {
                        if(component.isWatching(key)){ //функция из ExcelComponent
                            const changes = {[key]: state[key]}
                            component.storeChanged(changes)
                        }
                    })
                }
            })

            this.prevState = this.store.getState()
            if(process.env.NODE_ENV === 'development') {
                window['redux'] = this.prevState
            }
        })
    }

    unsubscribeFromStore() {
        this.sub.unsubscribe()
    }
}