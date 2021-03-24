//для более удобной работы с DOM-деревом
class Dom{
    constructor(selector) {     //----НАХОДИТ ЭЛЕМЕНТ И ЦЕПЛЯЕТ ЗА $el--------------------
                                //--ПРИНИМАЕТ СЕЛЕКТОР ИЛИ ЭЛЕМЕНТ(НОДУ) ЦЕЛИКОМ ДАЖЕ------
        this.$el = typeof selector === 'string' //если строка
        ? document.querySelector(selector) //присваивает в $el первое, что нашлось по selector
        : selector      //а если нам передали целиком ДОМ-ноду, то просто присваиваем
}

    html(html) { //-----МЕТОД ОБРАБОТКИ HTML-СОДЕРЖИМОГО ДЛЯ НАЙДЕННОГО ВЫШЕ ЭЛЕМЕНТА $el-----------------------
        // геттер или сеттер: если ничего не передаём, то это геттеР; если передаём, то Сеттер
        if(typeof html === 'string') {
            this.$el.innerHTML = html   // назначаем значение из переданного
            return this   // а зачем?? а чтобы было к чему цеплять цепочки методов, напрмимер .clear()
        }
        return this.$el.outerHTML.trim() //а если ничего не передали, то возвращаем обрезанную обёртку this.$el
    }

    text(text){
        if (typeof text === 'string'){
            this.$el.textContent = text
            return this
        }
        if (this.$el.tagName.toLowerCase() === 'input'){
            return this.$el.value.trim()
        }
        return this.$el.textContent.trim()
    }

    clear() {
        this.html('') //очистим HTML
        return this
    }

    on(eventType, callback) {
        this.$el.addEventListener(eventType, callback)
    }

    off(eventType, callback) {
        this.$el.removeEventListener(eventType, callback)
    }

    find(selector) {        // находит элемент по селектору
        return $(this.$el.querySelector(selector))
    }

    //element
    append(node) {
        if(node instanceof Dom){
            node = node.$el
        }

        if (Element.prototype.append) { //если такой метод присутствует в базовом классе Element
            this.$el.append(node)
        }
        else {
            this.$el.appendChild(node)
        }
        return this
    }

    get data() {
        return this.$el.dataset
    }

    closest(selector) {
        return $(this.$el.closest(selector))
    }

    getCoords(){
        return this.$el.getBoundingClientRect() //вернёт объект DOMRect из кучи координат и широт :)
    }

    findAll(selector) { // метод, чтобы искать чисто по экземпляру класса ДОМ, т.е. внутри себя
        return this.$el.querySelectorAll(selector)
    }

    css(styles = {}){ //принимает объект из стилей типа {height:'24px', color:'red'}
      // так как в объекте стилей может быть много элементов, то добываем их и крутим цикл
      Object
          .keys(styles)
          .forEach(key=> {
          this.$el.style[key] = styles[key];
      })
    }

    id(parse){      //метод для получения айдишника ячейки в формате строка:столбец
        if(parse){
            const parsed = this.id().split(':')
            return {
                row: +parsed[0],
                col: +parsed[1]
            }
        }
        return this.data.id
    }

    focus(){
        this.$el.focus()
        return this
    }

    addClass(className){
        this.$el.classList.add(className)
        return this
    }

    removeClass(className) {
        this.$el.classList.remove(className)
        return this
    }
}

//event.target
export function $(selector){ //----СОЗДАЁТ НОВЫЙ ЭКЗЕМПЛЯР КЛАССА Dom, ГДЕ ПО СЕЛЕКТОРУ ПОДЦЕПЛЯЕТ ЭЛЕМЕНТ В $el
    return new Dom(selector);//---ЛИБО ПРИНИМАЕТ И ПОДЦЕПЛЯЕТ НОДУ ЦЕЛИКОМ...И ВОЗВРАЩАЕТ ЭТОТ ЭКЗЕМПЛЯР
}

$.create = (tagname, classes = '') => { //СОЗДАЁТ НОВЫЙ ЭЛЕМЕНТ ИЗ ТЕГОВ И ДАЖЕ С КЛАССАМИ(если их ей передали)
    // это метод функции $, так как она возвращает экземпляр класса DOM
    const el = document.createElement(tagname);
    if (classes) {
        el.classList.add(classes);
    }
    return $(el)
}