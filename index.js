import DidactDOM from './DidactDOM'
import Didact from './Didact'

/** @jsx Didact.createElement */
function Counter() {
    const [state, setState] = DidactDOM.useState(1)
    return (
        <h1 onClick={() => setState(c => c + 1)}>
            Count: {state}
        </h1>
    )
}

const element = <Counter />
// const element = (
//     <div id="foo">
//         <a>bar</a>
//         <b />
//     </div>
// )

const container = document.getElementById("root")
DidactDOM.render(element, container)