/**     CalculateJS
 *
 * Programmer: Zachariah Magee
 * October 2022
 * Web - Programming
 * Project 2: Calculator
 *
 **/

// finish reducer and move the display updates into the App() function after each event handler
// finish event handlers
// figure out how to make parse and evaluate/ resolve() work properly

import {useReducer} from "./Extensions.js";
import {evaluate, parse} from "./calc.js";

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0,
});

function formatOperand(operand) {
    if (operand == null) return;
    const [integer, decimal] = operand.split('.');
    if (decimal == null) return INTEGER_FORMATTER.format(integer);
    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

const ACTIONS = {
    add_digit:          'add-digit',
    delete_character:   'delete-character',
    add_operator:       'add-operator',
    clear_display:      'clear-display',
    update_history:     'update-history',
    evaluate:           'evaluate',
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case ACTIONS.add_digit:
            if (payload.digit === "0" && state.current_operation === "0") return state;
            if (payload.digit === "." && state.current_operation.includes(".")) return state;
            return {
                ...state,
                current_operation: `${state.current_operation || ''}${payload.digit}`,
            }
        case ACTIONS.delete_character:
            if (state.current_operation === '') return state;
            if (state.current_operation.length === 1) {
                return { ...state, current_operation: updateDisplay('') };
            }
            return {
                ...state,
                current_operation: state.current_operation.slice(0, -1),
            }
        case ACTIONS.add_operator:
            if (state.current_operation === '') return state
            return {
                ...state,
                operator: payload.operator,
                current_operation: `${state.current_operation || ''} ${payload.operator}`,
                display: updateDisplay(`${payload.operator}`),
                history: updateHistory(state.current_operation)
            }
        case ACTIONS.clear_display:
            return {}
        case ACTIONS.update_history:
            return {}
        case ACTIONS.evaluate:
            let solution = resolve(state.current_operation.split(''))
            return {
                current_operation: updateDisplay(solution.toString())

            }
    }
}

function resolve(expression) {
    let tokens = parse(expression);
    return evaluate(tokens)
}

const initialState = {
    current_operation: '',
    display: '',
    history: '',
}

const App = () => {
    const [getState, dispatch] = useReducer(reducer, initialState)

    /** Digit event listeners **/
    const digits = document.querySelectorAll('.digit')
    digits.forEach((digit, index, arr) => {
        digit.addEventListener('click', (e) => {
            dispatch({
                type: ACTIONS.add_digit,
                payload: {
                    digit: e.target.id
                }
            })
            updateDisplay(getState().current_operation)
        })
    })

    /** All Clear event listener **/


    /** Delete event listener **/
    document.querySelector('.delete')
        .addEventListener('click', () => {
            dispatch({
                type: ACTIONS.delete_character
            })
        })

    /** Operator event listeners **/
    const operators = document.querySelectorAll('.operator')
    operators.forEach((op) => {
        op.addEventListener('click', (e) => {
            dispatch({
                type: ACTIONS.add_operator,
                payload: {
                    operator: e.target.id
                }
            })
        })
    })

    /** Sign - Negation event listener **/


    /** Percent event listener **/


    /** Equal event listener **/
    document.querySelector('.equals')
        .addEventListener('click', () => {
            dispatch({
                type: ACTIONS.evaluate
            })
        })

}




/** updateDisplay
 * @param {string} updated_operand
 * @return text content of current display
 * **/
const updateDisplay = (updated_operand) => {
    document.querySelector('#current').innerText = updated_operand
    return updated_operand
}

const updateHistory = (updated_history) => {
    document.querySelector('#history').appendChild(generateHistory(updated_history))
    return updated_history
}

function generateHistory(content) {
    const newElement = document.createElement('p');
    newElement.classList.add('history');
    newElement.innerText = content;
    // newElement.style.display = 'block'
    return newElement;
}

const updateOperation = (updated_operator) => {
    document.querySelector('.operation').innerText = updated_operator
    return updated_operator
}

App()

// const updateEntireDisplay = (operand, previous, operator) => {
//     updateDisplay(operand)
//     updateHistory(previous)
//     updateOperation(operator)
// }

// updateEntireDisplay(current_operand, previous_operand, operation)