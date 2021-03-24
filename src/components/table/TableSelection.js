export class TableSelection {
    static className = 'selected'
    constructor() {
        this.group = []
        this.current = null
    }

    //$el это экземпляр класса ДОМ
    select($el){    //назначает элементу доп класс Selected, чтобы элемент выделился
        this.clear()
        $el.focus().addClass(TableSelection.className)
        this.group.push($el)
        this.current = $el
    }

    clear(){
        this.group.forEach($c => $c.removeClass(TableSelection.className))
        this.group = []
    }
        //deselect($el){  --- это был мой хороший вариант метода clear()
        //    this.group.pop().removeClass("selected")
        //}

    selectGroup($group = []){
        this.clear();
        this.group = $group
        this.group.forEach($el => $el.addClass(TableSelection.className))
    }
}