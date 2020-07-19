import DidactDOM from './DidactDOM'
import Didact from './Didact'

/** @jsx Didact.createElement */
const element = (
    <div id="foo">
        <a>bar</a>
        <b />
    </div>
)

const container = document.getElementById("root")
DidactDOM.render(element, container)