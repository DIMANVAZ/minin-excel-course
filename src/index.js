import './scss/index.scss'
import {Excel} from "@/components/excel/Excel";
import {Header} from "@/components/header/Header";
import {Toolbar} from "@/components/toolbar/Toolbar";
import {Formula} from "@/components/formula/Formula";
import {Table} from "@/components/table/Table";
import {rootReducer} from "@/redux/rootReducer";
import {createStore} from "@core/createStore";
import {storage, debounce} from "@core/utils";
import {initialState} from "@/redux/initialState";

const store = createStore(rootReducer, initialState)
    // {exampleKey:'this is example value'
    //colState: {}    //объект для хранения состояния размерности колонок в формате {3:'374'} ({'id':width})
    //})

const stateListener = debounce(state => {
    console.log('App state: ', state)
    storage('excel-state', state)
}, 300)

store.subscribe(stateListener)

const excel = new Excel('#app',{
    components:[Header, Toolbar, Formula, Table],
    store
})

excel.render()