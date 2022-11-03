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

export { useState, useReducer }

// const validateAction = action => {
//     if (!action || typeof action !== 'object' || Array.isArray(action)) {
//         throw new Error('Action must be an object!')
//     }
//     if (typeof action.type === 'undefined') {
//         throw new Error('Action must have a type!')
//     }
// };
//
// const stateRelay = (reducer, initialState) => {
//     let state = initialState;
//     const subscribers = [];
//     const store = {
//         dispatch: action => {
//             validateAction(action);
//             state = reducer(state, action);
//             subscribers.forEach(handler => handler());
//         },
//         getState: () => state,
//         subscribe: handler => {
//             subscribers.push(handler);
//             return () => {
//                 const index = subscribers.indexOf(handler);
//                 if (index > 0) {
//                     subscribers.splice(index, 1);
//                 }
//             };
//         }
//     };
//     store.dispatch({type: 'INITIALIZE_STORE'});
//     return store;
// };
//
// const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
//     maximumFractionDigits: 0,
// });
//
// function formatOperand(operand) {
//     if (operand == null) return;
//     const [integer, decimal] = operand.split('.');
//     if (decimal == null) return INTEGER_FORMATTER.format(integer);
//     return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
// }
//
// export { formatOperand, stateRelay }
//
