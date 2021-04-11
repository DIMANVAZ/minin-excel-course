// -pure function
import {
    APPLY_STYLE,
    CHANGE_STYLES,
    CHANGE_TEXT,
    CHANGE_TITLE,
    TABLE_RESIZE,
    UPDATE_DATE
} from "@/redux/types";
import {toInlineStyles} from "@core/utils";

export function rootReducer(state, action){
    let  field
    let val
    switch(action.type){

        case TABLE_RESIZE:
            field = action.data.type === 'col' ? 'colState' : 'rowState'
            return {...state, [field]: value(state, field, action)} //prevState = {id колонки, value в пикселях}

        case CHANGE_TEXT:
            field = 'dataState'
            return {
                ...state,
                currentText: action.data.value,
                [field]: value(state, field, action)
            }

        case CHANGE_STYLES: //CURRENT_STYLES
            return {...state, currentStyles: action.data}

        case APPLY_STYLE:
            field = 'stylesState'
            val = state[field] || {}  // типа state.stylesState
            action.data.ids.forEach(id => {
                val[id] = {...val[id], ...action.data.value}
                /*  action.data.value - это, например, {textDecoration: "underline"}
                    action.data - это сложный объект, например
                        { ids: ["0:0"],
                        value: {textDecoration: "none"}
                    state - объект из colState, rowState, stylesState ...
                    val - сложный объект {0:0: {…}, 3:0: {…}, 2:0: {fontWeight: "bold"}}  */
            })
            return{
                ...state,
                [field]: val,
                currentStyles: {...state.currentStyles, ...action.data.value}
            }
        case CHANGE_TITLE:
            return {...state, title: action.data}

        case UPDATE_DATE:
            return {...state, openedDate: new Date().toJSON()}
        default: return state
    }
}

function value(state, field, action) {
    const val = state[field] || {}  // засохраним в неё нынешнее состояние state
    val[action.data.id] = action.data.value  //добавим ещё значение, чтобы объект не перезатирался (как раньше)
    return val
}