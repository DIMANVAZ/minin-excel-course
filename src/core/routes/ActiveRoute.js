export class ActiveRoute {
    static get path() {
        return window.location.hash.slice(1) // вызывает хэш и отрезает #: было localhost:3000/#test =>  вернёт test
    }

    static get param() {
        return ActiveRoute.path.split('/')[1] //способ получения параметров
    }

    static navigate(path) {
        window.location.hash = path
    }
}