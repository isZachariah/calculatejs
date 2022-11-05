function useState(obj) {
    let initialState = obj;
    const reducer = fn => {
        let newState;
        typeof fn === 'function'
            ? newState = fn(initialState)
            : newState = fn;
        Object.assign(initialState, newState);
    };
    return [initialState, reducer];
}

function useReducer(reducer, initialState = {}) {
    let state = initialState;
    const store = {
        dispatch: (action) => {
            state = reducer(state, action)
        },
        getState: () => state
    }
    return [store.getState, store.dispatch]
}

function generateElement(element, id, classes, content) {
    const newElement = document.createElement(element);
    newElement.id = id;
    newElement.classList.add(...classes);
    newElement.innerHTML = content;
    return newElement;
}

export { useState, useReducer, generateElement }
