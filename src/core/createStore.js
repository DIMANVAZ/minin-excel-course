export function createStore(rootReducer, initialState = {}){
    let state = rootReducer({...initialState}, {TYPE: '__INIT__'}); //reducer всегда возвращает нам STATE
    // ^^ это начальное состояние - рутРедюсер вернёт нам initialState, т.к. action-a с таким типом не существует
    // ... - мы склонируем initialState (чтобы не было "мутаций")
    let listeners = []

    return {
        subscribe(fn){
            listeners.push(fn)
            return {
                unsubscribe(){
                    listeners = listeners.filter(l => l !== fn)
                }
            }
        },
        dispatch(action) {
            state = rootReducer(state, action)
            listeners.forEach(listener => listener(state))
        },
        getState(){
            return JSON.parse(JSON.stringify(state)) //это мы так "глубоко склонировали" state, чтобы у копии было другое место в памяти
        }
    }
}