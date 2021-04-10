import {DomListener} from '@core/DomListener';

export class ExcelComponent extends DomListener {
  constructor($root, options = {}) {
    super($root, options.listeners)
    this.name = options.name || ''
    this.emitter = options.emitter
    this.subscribe = options.subscribe || []
    this.store = options.store
    this.unsubscribers = []

    this.prepare()
  }
  //настраиваем наш компонент до init
  prepare() {}

  // Возвращает шаблон компонента
  toHTML(){
    return ''
  }

  // уведомляем слушателей про событие event - интерфейс, позволяющий взаимодействовать с эмиттером
  $emit(event, ...args) {
    this.emitter.emit(event, ...args)
   }

  // подписываемся на событие event
  $on(event, fn){
   const unsub = this.emitter.subscribe(event, fn)
    this.unsubscribers.push(unsub)
  }

  $dispatch(action){
    this.store.dispatch(action)
  }

  // сюда приходят только изменения по тем полям, на которые мы подписались
  storeChanged(){

  }

  isWatching(key){
    return this.subscribe.includes(key)
  }

  // инициализируем компонент
  // добавляем DOM-слушателей
  init() { //потом он вызывается в Excel.js для каждого компонента
    this.initDOMListeners()
  }

  // удаляем компонент
  // чистим слушатели
  destroy() {
      this.removeDOMListeners()
      this.unsubscribers.forEach(unsub => unsub())
  }
}