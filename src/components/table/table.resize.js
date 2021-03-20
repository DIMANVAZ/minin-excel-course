import {$} from "@core/dom";

export function resizeHandler($root, event) {
    const $resizer = $(event.target)    //оборачиваем объект event.target в нашу DOM-утилиту
    const $parent = $resizer.closest('[data-type="resizeable"]')
    const coords = $parent.getCoords()
    const type = $resizer.data.resize
    const sideProp = type === 'col' ? 'bottom' : 'right'
    let value

    $resizer.css({
        opacity: 1,
        [sideProp]: '-5000px'
    })

    document.onmousemove = e => {
        // ^вычисляем разницу между положением мыши и координатами правой стороны столбца-родителя^
        //--а потом меняем ширину столбца-родителя:
        if(type === 'col'){
            const delta = e.pageX - coords.right
            value = coords.width + delta
            $resizer.css({right: -delta + 'px'}) //-delta, потому что с + она в обратную сторону ресайзит
        } else {
            const delta = e.pageY - coords.bottom
            value = coords.height + delta
            $resizer.css({bottom: -delta + 'px'})
        }
    }

    document.onmouseup = ()=> {     //удаляем(обнуляем) все накрученные сотни маус-мувов при отжимании мышки
        document.onmousemove = null
        document.onmouseup = null

        if(type === 'col') {
            $parent.css({width: value + 'px'})
            $root.findAll(`[data-col="${$parent.data.col}"]`)
                .forEach(el => el.style.width = value + 'px')
        } else {
            $parent.css({height: value + 'px'})
        }

        $resizer.css({
            opacity:0,
            bottom:0,
            right:0
        })
    }
}

