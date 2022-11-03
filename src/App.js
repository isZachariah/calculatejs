/**     CalculateJS
 *
 * Programmer: Zachariah Magee
 * October 2022
 * Web - Programming
 * Project 2: Calculator
 *
 **/
import {dom, render} from "./jsx_runtime";
import { formatOperand, stateRelay } from "./Extensions";
import {JSDOM} from "jsdom";
// const ACTIONS = {
//   add_digit: 'add-digit',
//   delete_digit: 'delete-digit',
//   clear_display: 'clear-display',
//   update_history: 'update-history'
// };
// const reducer = (state, action) => {
//   switch (action.type) {
//     case ['add_digit']:
//       console.log(action.payload.digit);
//       return {
//         ...state,
//         currentOperation: `${state.currentOperation}${action.payload.digit}`
//       };
//   }
// };
// const initialState = {
//   currentOperation: '',
//   previousOperation: '',
//   history: ''
// };

/** @jsx dom */
function App() {
  // const {
  //   state,
  //   dispatch
  // } = stateRelay(reducer, initialState);
  // function digitClick(e) {
  //   dispatch({
  //     type: ACTIONS.add_digit,
  //     payload: {
  //       digit: ''
  //     }
  //   });
  // }
  return dom("div", {
    className: "calculator-js"
  }, dom("div", {
    id: "container",
    className: "container"
  }, dom("div", {
    className: "calculator"
  }, dom("div", {
    className: "display"
  }, dom("h3", {
    className: "previous-operand",
    id: "previous"
  }), dom("h2", {
    className: "current-operand",
    id: "current"
  })), dom("div", {
    className: "button-grid"
  }, dom("button", {
    id: "parens",
    value: "("
  }, "'('"), dom("button", {
    className: "operator",
    id: "sign",
    value: "-/+"
  }, "'-/+'"), dom("button", {
    className: "operator",
    id: "percent",
    value: "%"
  }, "'%'"), dom("button", {
    id: "clear",
    value: "clear"
  }, "'AC'"), dom("button", {
    className: "digit",
    value: "1"
  }, "'1'"), dom("button", {
    className: "digit",
    value: "2"
  }, "'2'"), dom("button", {
    className: "digit",
    value: "3"
  }, "'3'"), dom("button", {
    className: "operator",
    id: "divide",
    value: "/"
  }, "'\xF7'"), dom("button", {
    className: "digit",
    value: "4"
  }, "4"), dom("button", {
    className: "digit",
    value: "5"
  }, "5"), dom("button", {
    className: "digit",
    value: "6"
  }, "6"), dom("button", {
    className: "operator",
    id: "multiply",
    value: "*"
  }, "'*'"), dom("button", {
    className: "digit",
    value: "7"
  }, "'7'"), dom("button", {
    className: "digit",
    value: "8"
  }, "'8'"), dom("button", {
    className: "digit",
    value: "9"
  }, "9"), dom("button", {
    className: "operator",
    id: "subtract",
    value: "-"
  }, "'-'"), dom("button", {
    className: "digit",
    id: "decimal",
    value: "."
  }, "'.'"), dom("button", {
    className: "digit",
    value: "0"
  }, "'0'"), dom("button", {
    className: "equals",
    id: "equals",
    value: "="
  }, "'='"), dom("button", {
    className: "operator",
    id: "add",
    value: "+"
  }, "'+'"))), dom("div", {
    className: "calculation-history"
  })));
}
const app = document.querySelector('.app');
// app.appendChild(App());
const root = new JSDOM('<!DOCTYPE html><body></body>')

render(app, root)