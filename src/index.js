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

document.querySelector('#current').textContent

const ACTIONS = {
    add_digit: 'add-digit',
    delete_digit: 'delete-digit',
    clear_display: 'clear-display',
    update_history: 'update-history',
    choose_operation: 'choose-operation'
}

const reducer = (state, {type, payload}) => {
    switch (type) {
        case ACTIONS.add_digit:
            console.log(payload.digit)
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
                current_operand: document.querySelector('#current').textContent =`${state.current_operand || ''}${payload.digit}`
            }
        case ACTIONS.delete_digit:
            if (state.overwrite) {
                return {
                    ...state,
                    overwrite: false,
                    current_operand: null,
                };
            }
            if (state.current_operand == null) return state;
            if (state.current_operand.length === 1) {
                return { ...state, current_operand: null };
            }
            return {
                ...state,
                current_operand: state.current_operand.slice(0, -1),
            };
        case ACTIONS.clear_display:

            return {}
        case ACTIONS.update_history:

            return {}
    }
}



const initialState = {
    current_operand: '',
    previous_operand: '',
    history: '',
}

const [{current_operand, previous_operand, history}, dispatch] = useReducer(reducer, initialState)


const digits = document.querySelectorAll('.digit')
digits.forEach((digit, index, arr) => {
    digit.addEventListener('click', (e) => {
        // console.log(e.target.id)
        dispatch({
            type: ACTIONS.add_digit,
            payload: {
                digit: e.target.id
            }
        })
    })
})





document.querySelector('#current').textContent = current_operand



