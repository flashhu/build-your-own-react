// import DidactDOM from './DidactDOM'
// import Didact from './Didact'

function createElement(type, props, ...children) {
    return {
        type,
        props: {
            ...props,
            children: children.map(child =>
                typeof (child) === "object"
                    ? child
                    : createTextElement(child)
            ),
        }
    }
}

function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function createDom(fiber) {
    const dom =
        fiber.type === "TEXT_ELEMENT"
            ? document.createTextNode("")
            : document.createElement(fiber.type);
    const isProperty = key => key != "children";
    Object.keys(fiber.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = fiber.props[name]
        })
    return dom;
}

function commitRoot() {
    commitWork(wipRoot.child)
    wipRoot = null
}

function commitWork(fiber) {
    if (!fiber) {
        return 
    }
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom);
    commitWork(fiber.child);
    commitWork(fiber.sibling);
}

function render(element, container) {
    // root
    wipRoot = {
        dom: container,
        props: {
            children: [element]
        }
    }
    nextUnitOfWork = wipRoot
}

let nextUnitOfWork = null
let wipRoot = null

function workLoop(deadline) {
    let shouldYield = false;
    // 有工作且有剩余时间
    while ( nextUnitOfWork && !shouldYield) {
        nextUnitOfWork = peformUnitOfWork(nextUnitOfWork);
        shouldYield = deadline.timeRemaining() < 1;
    }

    if( !nextUnitOfWork && wipRoot) {
        commitRoot();
    }

    // like setTimeout 在浏览器的空闲时段内调用的函数排队
    requestIdleCallback(workLoop)
}

requestIdleCallback(workLoop)

function peformUnitOfWork(fiber) {
    // add dom node
    if(!fiber.dom) {
        fiber.dom = createDom(fiber)
    }

    // create new fibers
    const elements = fiber.props.children;
    let index = 0;
    let prevSibling = null; //之前的兄弟节点
    while( index < elements.length ) {
        const element = elements[index];

        const newFiber = {
            type: element.type,
            props: element.props,
            parent: fiber,
            dom: null
        }

        // 子节点 或 兄弟节点
        if(index === 0) {
            fiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }

        // ?
        prevSibling = newFiber;
        index ++;
    }

    // return next unit of work
    // 1. child node
    if(fiber.child) {
        return fiber.child;
    }
    let nextFiber = fiber;
    while (nextFiber) {
        // 2. sibling node
        if(nextFiber.sibling) {
            return nextFiber.sibling;
        }
        // 3. sibling of the parent
        nextFiber = nextFiber.parent
    }
}

const Didact = {
    createElement
}

const DidactDOM = {
    render
}

const element = Didact.createElement(
    "div",
    { id: "foo" },
    Didact.createElement("a", null, "Hello"),
    Didact.createElement("b")
)

const container = document.getElementById("root")
DidactDOM.render(element, container)