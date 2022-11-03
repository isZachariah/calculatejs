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

// document.querySelector('#current').textContent

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
                    current_operand: payload.digit,
                    overwrite: false,
                };
            }
            if (payload.digit === "0" && state.current_operand === "0") return state;
            if (payload.digit === "." && state.current_operand.includes("."))
                return state;
            return {
                ...state,
                current_operand: updateDisplay(`${state.current_operand || ''}${payload.digit}`)
            }
        case ACTIONS.delete_digit:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    current_operand: updateDisplay(''),
                };
            }
            if (state.current_operand == null) return state;
            if (state.current_operand.length === 1) {
                return { ...state, current_operand: updateDisplay('') };
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
                    operation: updateOperation(payload.operation),
                };
            }

            if (state.previous_operand == null) {
                return {
                    ...state,
                    operation: updateOperation(payload.operation),
                    previous_operand: updatePrevDisplay(state.current_operand),
                    current_operand: updateDisplay(''),
                };
            }

            return {
                ...state,
                previous_operand: updatePrevDisplay(evaluate(state)),
                operation: updateOperation(payload.operation),
                current_operand: updateDisplay(''),
            };

        case ACTIONS.evaluate:

            return {}
    }
}

const evaluate = ({}) => {

}

const initialState = {
    current_operand: '',
    previous_operand: '',
    operation: '',
    history: '',
}

const [{current_operand, previous_operand, history}, dispatch] = useReducer(reducer, initialState)

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
document.querySelector('.operator')
    .addEventListener('click', (e) => {
        dispatch({
            type: ACTIONS.choose_operation,
            payload: {
                operator: e.target.id
            }
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
    return document.querySelector('#current').textContent = updated_operand
}

const updatePrevDisplay = (updated_previous) => {
    return document.querySelector('#previous').textContent = updated_previous
}

const updateOperation = (updated_operator) => {
    return document.querySelector('.operation').textContent = updated_operator
}