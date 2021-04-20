export class Page {
    constructor(params) {
        this.params = params // из всей строки http://localhost:3000/#excel/1618943268503, params = 1618943268503
    }

    getRoot() {
        throw new Error("Method getRoot should be implemented")
    }

    afterRender() {}

    destroy() {}
}
