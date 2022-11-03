/**             calcjs
*
* Programmer: Zachariah Magee
* Class: WCC SD230 Web Programming
* Project 1 Part 3 --- Calculator
*
* Create a program that functions as a calculator.
* The program stores each user input one at a time until an "=" sign is input.
* At which point the values input should be processed as a calculator would.
* 1000 + 5 * 3 =
* Assume this is input one at a time. [1,0,0,0,"+",5,"*",3,"="]
*
* Order of operations must be considered. Parenthesis and Exponents need not be handled nor do you have to handle decimals.
* Major Extra credit if you handle the PE in PEMDAS and add decimals.
*
* Values it must handle.
* [0,1,2,3,4,5,6,7,8,9,"+","-","/","*","="]
*
* ----------------------------------------------- My approach.....
*
* Because at this point this is meant to be a simple console calculator my goal is to use prompt-sync to take in values and
* add them to an array that will then be tokenized. Previously I wrote the program to take in an entire expression as a string
* which would then be parsed and tokenized BUT in order to go along with the directions more acutely I think this is
* a better approach.
**/

/** imports and requirements **/
let prompt = require('prompt-sync')();
const fs = require('fs');

/** objects - constants **/
const constants = {
    pi: Math.PI,
    ln10: Math.LN10,
    ln2: Math.LN2,
    log2e: Math.LOG2E,
    log10e: Math.LOG10E,
    sqrt1_2: Math.SQRT1_2,
    sqrt2: Math.SQRT2,
    e: Math.E,
};

const constant_names = Object.keys(constants);

/** token types
 * These types are used to categorize tokens to be evaluated.
 * Literals and constants are operands, operations and functions are operators.
 * Identifiers are yet to be implemented. Brackets are primarily used for parentheses.
 * **/
const types = {
    literal: 'number',
    constant: 'constant',
    identifier: 'identifier',
    operation: 'operator',
    function: 'functions',
    bracket: { left: 'left bracket', right: 'right bracket' },
};

const brackets = {
    left: '({[',
    right: ')}]'
}

/** operations and functions **/

/** Generate functions receives a clojure/ function, a type, a precedence, and a boolean and returns an object including each */
const generateFunction = (evaluation, operation, type = types.function, precedence = 0, left_assoc = true) => {
    return {
        eval: evaluation,
        operation: operation,
        type: type,
        precedence: precedence,
        left_assoc: left_assoc
    };
};

/** Unary Functions that take one parameter;
* type = function; precedence = 0; associativity = left
sin cos tan arcsin arccos arctan ln log sqrt abs round ceil
*/
const unary_functions = {
    sin: generateFunction((x) => Math.sin(x), 'sin'),
    cos: generateFunction((x) => Math.cos(x), 'cos'),
    tan: generateFunction((x) => Math.tan(x), 'tan'),
    arcsin: generateFunction((x) => Math.asin(x), 'arcsin'),
    arccos: generateFunction((x) => Math.acos(x), 'arccos'),
    arctan: generateFunction((x) => Math.atan(x), 'arctan'),
    ln:  generateFunction((x) => Math.log(x), 'ln'),
    log: generateFunction((x) => Math.log10(x), 'log'),
    sqrt:generateFunction((x) => Math.sqrt(x), 'sqrt'),
    abs: generateFunction((x) => Math.abs(x), 'abs'),
    round: generateFunction((x) => Math.round(x), 'round'),
    floor: generateFunction((x) => Math.floor(x), 'floor'),
    ceil: generateFunction((x) => Math.ceil(x), 'ceil'),
};

/** Binary functions take two parameters and vary in precedence and left association
addition: + subtraction - multiplication: * division: / modulus: % power: ^ max min
*/
const binary_functions = {
    '+': generateFunction((x, y) => x + y, 'addition', types.operation, 2),
    '-': generateFunction((x, y) => x - y, 'subtraction',types.operation, 2),
    '*': generateFunction((x, y) => x * y, 'multiplication', types.operation, 3),
    '/': generateFunction((x, y) => x / y, 'division', types.operation, 3),
    '%': generateFunction((x, y) => x % y, 'modulus', types.operation, 3),
    '^': generateFunction((x, y) => Math.pow(y, x), 'power', types.operation,1, false),
    max: generateFunction((x, y) => Math.max(x, y), 'max'),
    min: generateFunction((x, y) => Math.min(x, y), 'min')
};

// Function and Operation Helpers

/** function not operation **/
const functionNotOperation = (func) => func.type === types.function;

/** is an operation or function
* @param {string} token
* @return {boolean} true if token is an operation or a function
**/
function isOperationOrFunction(token) {
    return token in unary_functions || token in binary_functions;
}

/** find element
* Takes in an element and checks if it is an operation or a function,
* returning an object with the value
*
* @param {string} token
* @returns {object}
* */
function findElement(token) {
    if (token in unary_functions) return unary_functions[token]
    if (token in binary_functions) return binary_functions[token]
}

/** get precedence
* returns the numerical precedence of an operation or function
**/
function getPrecedence(element) {
    return element.precedence;
}

/** Takes in two operation (or function) objects - one from the stack and the newest
 * being tokenized, and returns a boolean depending upon which has greater precedence,
 * deciding if the on-stack operation should be popped off onto the queue or not.
 * @param {operation} on_stack
 * @param new_el
 * @return {boolean}
 * **/
const greaterPrecedence = (on_stack, new_el) => {
    return getPrecedence(on_stack) > getPrecedence(new_el);
}

/** Takes in two operation (or function) objects - one from the stack and the newest
 * being tokenized, and returns a boolean, because they have equal precedence,
 * if the on-stack is left associated it will be popped off onto the queue.
 * @param {operation} on_stack
 * @param new_el
 * @return {boolean}
 * **/
const equalPrecedence = (on_stack, new_el) => {
    return getPrecedence(on_stack) === getPrecedence(new_el) && association(on_stack);
}

/** association
* @param {object} element
* @returns {boolean} true if element is left associated false otherwise
**/
function association(element) {
    return element.value in binary_functions ?
    binary_functions[element.value].left_assoc : true;
}

// Literal Value and Constant Helpers

/** isNumber
* @param {string} token
* @return {boolean} true if token is a digit, a decimal, or a constant
**/
function isNumber(token) {
    return /\d/.test(token) || token === '.' || token in constants;
}

/** literal value
* @param {string} token
* @return {object} { type, value }
**/
function literalValue(token) {
    if (typeof token === 'number') return {
        type: types.literal,
        value: token
    }
    else if (token in constants) return {
        type: types.constant,
        value: constants[token]
    }
    else return {
        type: types.literal,
        value: parseFloat(token)
    }
}


// Parsing and Evaluation helpers
const last = stack => stack[stack.length-1];

/** parser
* This function takes a prefix expression in the form of a string array  as an argument,
 * transforms it into a postfix expression with additional information for each token,
 * and returns an object array.
* @param {string[]} expression
* @return {object[]}
**/
function parse(expression) {
    const queue = [];
    const stack = [];

    expression.forEach((token, index, array) => {
            if (isNumber(token)) {
                let el = literalValue(token)
                queue.push(el);
            }
            else if (token === 'random') {
                queue.push({type: types.literal, value: Math.random()});
            }
            else if (brackets.left.includes(token)) {
                stack.push('(');
            }
            else if (brackets.right.includes(token)) {
                while (last(stack) !== '(') {
                    queue.push(stack.pop());
                    if (stack.length <= 1 && stack[0] !== '(') {
                        throw new Error('Mismatched Parentheses');
                    }
                }
                stack.pop();
            }
            else if (isOperationOrFunction(token)) {
                let element = findElement(token);
                if (element.type === types.function) stack.push(element);
                else {
                    if (stack.length !== 0) {
                        while (functionNotOperation(last(stack)) ||
                        greaterPrecedence(last(stack), element) ||
                        equalPrecedence(last(stack), element)) {
                            queue.push(stack.pop());
                            if (stack.length === 0) break;
                        }
                    }
                    stack.push(element);
                }
            }
            else throw Error('Token not recognized');
    });
    while (stack.length !== 0) {
        if (last(stack) === '(' || last(stack) === ')') stack.pop();
        queue.push(stack.pop())
    }
    return queue
}

/** evaluate
* This function receives the parsed tokens from parse(), iterates through the postfix expression
 * and derives a result based on the input operands and operations
* @param {object[]} tokens
* @return {number}
**/
function evaluate(tokens) {
    let result = 0;
    let stack = [];
    tokens.forEach((element, index, array) => {
       switch (element.type) {
           case types.constant:
               stack.push(element.value);
               break;
           case types.literal:
               stack.push(element.value);
               break;
           case types.function:
               result = element.eval(stack.pop());
               stack.push(result);
               break;
           case types.operation:
               let a = stack.pop();
               let b = stack.pop();
               result = element.eval(a, b);
               stack.push(result);
               break;
       }
    });
    return result;
}

/** display
 * This function is meant to run parse and evaluate and display the results.
 * @param {string[]} expression
 * **/
function display(expression) {
    let tokens = parse(expression);
    let result = evaluate(tokens);
    console.log(`Solution: ${result}`);
}

/** save
 * This function is meant to output a file when the user types 'save' into their console with the program running.
 * The contents of the file will be the expression as well as the solution.
 * @param {string[]} expression
 * @output file calculations.txt
 * **/
function save(expression) {
    let tokens = parse(expression);
    let result = evaluate(expression);
    let print = `Expression: ${expression}\nSolution: ${result}\n\n`;
    fs.writeFile('./calculations.txt', print, { flag: 'a+' }, err => {
        if (err) {
            console.log(err);
        }
    });
}

/** Console menu interaction functions **/

const program = () => {
    console.log(`Welcome to Calcjs.\n`);
    console.log(options);
    let run = true;
    let expression = [];
    while (run) {
        let input = '';
        while (input !== '=') {
            input = prompt(`Enter a token or expression: `)
            switch (input) {
                case 'help'     : console.log(help); break;
                case 'how'      : console.log(how_it_works); break;
                case 'options'  : console.log(options); break;
                case 'details'  : console.log(expression); display(expression); break;
                case 'save'     : save(expression); break;
                case 'clear'    : expression = []; break;
                case 'exit'     : console.log(thanks); run = false; return;
                case '='        : display(expression); break;
                default         :
                    input.split(' ').forEach((token) => {
                        expression.push(token);
                    });
                    break;
            }
        }
    }
}

const options = `
                Options:

-- =          to evaluate an expression
-- how        to read how exactly it works
-- help       if you need further assistance
-- details    if you'd like to inspect the process
-- options    to see this more concise menu
-- save       output calculation details to a txt file
-- clear      clear the stack and start new calculation
-- exit       to exit the program
`;

const how_it_works = `
                        How it works:

This calculator can handle a variety of operators and functions,
negative numbers, floating point numbers, and whole numbers, there
are pre-programmed constants and the order of operations is adhered to.

If you would like help at any point simply type the word 'help' into your
console and further explanation will be presented.

Simply type each piece of your expression into the console, one at a time,
pressing enter after each entry, and concluding with the '=' and you will
be returned the solution.

Alternatively you can type each element token by token each seperated by a space,
press enter, and then enter '=' and that would also work. for example:

Enter a token or expression: 50 * ( 1 + 1 )
Enter a token or expression: =
Solution: 100

If you would like to see this explanation again simply type 'how' and it will
pop back up, to see your options more concisely type 'options'. To clear the
expression and start solving a new problem, type 'clear' and to output your
mathematics to a file called 'calculations.txt' type 'save'.

Thanks. Enjoy. Zzz.
`;

const help = `
                Help:

            Unary Functions:
    -  sin - cos - tan - ln - log -
-  sqrt - abs - round - floor - ceil  -
     -  arcsin - arccos - arctan -

example input: 'sqrt 16 =' output: 4
input 'sqrt16=' or 'sqrt' then '16' and then '='
would all get the exact same results.

            Binary Operations
    addition: +         subtraction: -
    multiplication: *   division: /
    modulus: %          power: ^
    max                 min

each of these operators would be input in between
two operands, for example:

'7 max 12' would return (12) or '15 * 3' returns (45)

                 Constants
    - pi - ln10 - ln2 - log2e - log10e -
            - sqrt1_2 - sqrt2 - e -

                   Random
To get a random number between zero and one simply
type 'random' and use it like a number.

                 Parentheses ()
Will affect the order of operations. Generally precedence
is such that ^ is evaluated first, then * / % and then + -
but anything within parentheses will first be evaluated on
its own and then operated on with the rest of the expression.
`;

const thanks = `
Thanks for using calcjs. Have a great day!
`

program();

export { parse, evaluate }