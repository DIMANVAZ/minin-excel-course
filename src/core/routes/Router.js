import {$} from "@core/dom";
import {ActiveRoute} from "@core/routes/ActiveRoute";

export class Router{
    constructor(selector, routes) {
        if(!selector) {
            throw new Error("Selector is not provided in Router")
        }

        this.$placeholder = $(selector)
        this.routes = routes

        this.page = null

        this.changePageHandler = this.changePageHandler.bind(this)

        this.init()
    }

    init() {
        window.addEventListener('hashchange', this.changePageHandler)
        this.changePageHandler()
    }

    changePageHandler() {
        //this.$placeholder.html('<h1>' + ActiveRoute.path + '</h1>') //при изменении хэша в строке отрисовывается H1
        // по этому принципу можно реализовать отрисовку и всей страницы

        if (this.page) { //для уничтожения страницы при переключении (и не будет пересечения между разными табличками)
            this.page.destroy()
        }

        this.$placeholder.clear()

        const Page = ActiveRoute.path.includes('excel')
            ? this.routes.excel
            : this.routes.dashboard

        this.page = new Page(ActiveRoute.param)

        this.$placeholder.append(this.page.getRoot())

        this.page.afterRender()
    }

    destroy(){
        window.removeEventListener('hashchange', this.changePageHandler)
    }
}