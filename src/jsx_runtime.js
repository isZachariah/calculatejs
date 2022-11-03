/** None of this is actually in use within the project, yet. It may or may not be
 * implemented dependent upon if I can figure out JSX (w/ webpack or typescript w/o react **/

function dom(tag, attrs, ...children) {
    // Custom Components will be functions
    if (typeof tag === 'function') { return tag() }
    // regular html tags will be strings to create the elements
    if (typeof tag === 'string') {

        // fragments to append multiple children to the initial node
        const fragments = document.createDocumentFragment()
        const element = document.createElement(tag)
        children.forEach(child => {
            if (child instanceof HTMLElement) {
                fragments.appendChild(child)
            } else if (typeof child === 'string'){
                const textNode = document.createTextNode(child)
                fragments.appendChild(textNode)
            } else {
                // later other things could not be HTMLElement not strings
                console.log('not appendable', child);
            }
        })
        element.appendChild(fragments)
        // Merge element with attributes
        Object.assign(element, attrs)
        return element
    }
}

function jsx(type, config) {
    if (typeof type === "function") {
        return type(config);
    }
    const { children = [], ...props } = config;
    const childrenProps = [].concat(children);
    return {
        type,
        props: {
            ...props,
            children: childrenProps.map((child) =>
                typeof child === "object" ? child : createTextElement(child)
            ),
        },
    };
}
function createTextElement(text) {
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: [],
        },
    };
}

/** Another version of the bove method **/
function render(element, container) {
    const dom =
        element.type = "TEXT-ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type)

    const isProperty = key => key !== 'children'
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
            dom[name] = element.props[name]
        })

    element.props.children.forEach(child =>
        render(child, dom)
    )

    container.appendChild(dom)
}

export {
    dom,
    jsx,
    render, }