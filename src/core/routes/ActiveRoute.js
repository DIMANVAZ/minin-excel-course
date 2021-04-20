export class ActiveRoute {
    static get path() {
        return window.location.hash.slice(1)
        // вызывает хэш и отрезает #: было #excel/1618942704148 =>  вернёт excel/1618942704148
    }

    static get param() {
        return ActiveRoute.path.split('/')[1] //способ получения параметров -
        // из строки http://localhost:3000/#excel/674494272 вернёт лишь последние цифры 674494272
    }

    static navigate(path) { // кнопка выхода из таблицы
        window.location.hash = path
            //здесь window.location.hash  - это #excel/1618942704148
    }
}