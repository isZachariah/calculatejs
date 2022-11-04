/**     CalculateJS
 *
 * Programmer: Zachariah Magee
 * October 2022
 * Web - Programming
 * Project 2: Calculator
 *
 **/

import { useState, useReducer } from "./Extensions.js";

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
    delete_digit:       'delete-digit',
    clear_display:      'clear-display',
    update_history:     'update-history',
    choose_operation:   'choose-operation',
    evaluate:           'evaluate',
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case ACTIONS.add_digit:
            if (state.overwrite) {
                return {
                    ...state,
                    current_operand: updateDisplay(payload.digit),
                    overwrite: false,
                };
            }
            if (payload.digit === "0" && state.current_operand === "0") return state;
            if (payload.digit === "." && state.current_operand.includes(".")) return state;
            return {
                ...state,
                current_operand: updateDisplay(`${state.current_operand || ''}${payload.digit}`),
            }
        case ACTIONS.delete_digit:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    current_operand: updateDisplay(null),
                };
            }
            if (state.current_operand == null) return state;
            if (state.current_operand.length === 1) {
                return { ...state, current_operand: updateDisplay(null) };
            }
            return {
                ...state,
                current_operand: updateDisplay(state.current_operand.slice(0, -1)),
            };
        case ACTIONS.clear_display:

            return {}
        case ACTIONS.update_history:

            return {}
        case ACTIONS.choose_operation:
            if (state.current_operand == null && state.previous_operand == null) {
                return state;
            }
            if (state.current_operand == null) {
                return {
                    ...state,
                    operation: updateOperation(payload.operator),
                };
            }
            if (state.previous_operand == null) {
                return {
                    ...state,
                    operation: updateOperation(payload.operator),
                    previous_operand: updatePrevDisplay(state.current_operand),
                    current_operand: updateDisplay(null),
                };
            }
            console.log(state.current_operand, state.previous_operand, payload.operator)
            console.log(evaluate(state.current_operand, state.previous_operand, payload.operator))
            return {
                ...state,
                previous_operand: updatePrevDisplay(formatOperand(evaluate(state.current_operand, state.previous_operand, payload.operator))),
                operation: updateOperation(payload.operator),
                current_operand: updateDisplay(null),
            };

        case ACTIONS.evaluate:

            return {}
    }
}

function evaluate(current_operand, previous_operand, operation) {
    const prev = parseFloat(previous_operand);
    const current = parseFloat(current_operand);
    if (isNaN(prev) || isNaN(current)) return "";
    let computation = "";
    switch (operation) {
        case "+":
            computation = prev + current;
            break;
        case "-":
            computation = prev - current;
            break;
        case "*":
            computation = prev * current;
            break;
        case "÷":
            computation = prev / current;
            break;
        default: return
    }
    return computation.toString();
}

const initialState = {
    current_operand: '',
    previous_operand: '',
    operation: '',
    history: '',
}

const [{current_operand, previous_operand, operation, history}, dispatch] = useReducer(reducer, initialState)



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
    })
})

/** All Clear event listener **/


/** Delete event listener **/
document.querySelector('.delete')
    .addEventListener('click', () => {
        dispatch({
            type: ACTIONS.delete_digit
        })
    })

/** Operator event listeners **/
const operators = document.querySelectorAll('.operator')
operators.forEach((op) => {
    op.addEventListener('click', (e) => {
        dispatch({
            type: ACTIONS.choose_operation,
            payload: {
                operator: e.target.id
            }
        })
    })
})

/** Sign - Negation event listener **/


/** Percent event listener **/


/** Equal event listener **/


/** updateDisplay
 * @param {string} updated_operand
 * @return text content of current display
 * **/
const updateDisplay = (updated_operand) => {
    document.querySelector('#current').innerText = updated_operand
    return updated_operand
}

const updatePrevDisplay = (updated_previous) => {
    document.querySelector('#previous').innerText = updated_previous
    return updated_previous
}

const updateOperation = (updated_operator) => {
    document.querySelector('.operation').innerText = updated_operator
    return updated_operator
}

// const updateEntireDisplay = (operand, previous, operator) => {
//     updateDisplay(operand)
//     updatePrevDisplay(previous)
//     updateOperation(operator)
// }

// updateEntireDisplay(current_operand, previous_operand, operation)