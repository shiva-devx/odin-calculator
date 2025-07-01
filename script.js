const display = document.querySelector(".display");
const numericKeys = document.querySelectorAll("button.numericKey");
const operatorKeys = document.querySelectorAll("button.operatorKey");


// variable
let leftOperand, rightOperand, operator;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    return a / b;
}


function acKey() {
    display.textContent = "";
    resetValues();
}

function delKey() {
    if (display.textContent.length !== 0) {
        display.textContent = display.textContent.substring(0, display.textContent.length - 1);
    }
}

function equalKey() {
    let result = evaluate(display.textContent);

    if (result === undefined || isNaN(result)) {
        display.textContent = "Error";
    } else {
        // display.textContent = result;
        // sendToDisplay(result);
        let resultStr;

        if (!Number.isInteger(result)) {
            resultStr = result.toFixed(3);

            resultStr = parseFloat(resultStr).toString();
        } else {
            resultStr = result.toString();
        }

        display.textContent = resultStr.length > 13
            ? result.toPrecision(10)
            : resultStr;

    }
}

function resetValues() {
    leftOperand = undefined;
    rightOperand = undefined;
    operator = undefined;
}

function operate(leftOperand, operator, rightOperand) {
    switch (operator) {
        case "+":
            return add(leftOperand, rightOperand);

        case "-":
            return subtract(leftOperand, rightOperand);

        case "*":
            return multiply(leftOperand, rightOperand);

        case "/":
            if (rightOperand !== 0) {
                return divide(leftOperand, rightOperand);
            } else {
                alert("Number format exception : cannot divide by 0");
                resetValues();
            }

    }
}

function clearDisplay() {
    display.textContent = "";
    resetValues();
}


function isChar(char) {
    return char >= '0' && char <= '9';
}

function precedence(op) {
    switch (op) {
        case '+':
        case '-':
            return 1;

        case '*':
        case '/':
            return 2;

        default:
            return 0;
    }
}
// evaluate function
function evaluate(expression) {
    let valueStack = [];
    let opsStack = [];

    for (let i = 0; i < expression.length; i++) {
        let ch = expression[i];

        if (ch === " ") continue;

        // handling number with decimal point
        if (isChar(ch) || ch === '.') {
            let numStr = '';
            while (i < expression.length
                && (isChar(expression[i])
                    || expression[i] === '.')
            ) {
                numStr += expression[i]; // this is a expression without any operator
                i++;
            }
            i--;
            valueStack.push(parseFloat(numStr));
        } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/') {
            while (opsStack.length !== 0 && precedence(opsStack[opsStack.length - 1]) >= precedence(ch)) {
                let right = valueStack.pop();
                let left = valueStack.pop();
                let op = opsStack.pop();
                valueStack.push(operate(left, op, right));
            }

            opsStack.push(ch);
        }
    }

    // final evaluation 
    while (opsStack.length !== 0) {
        let right = valueStack.pop();
        let left = valueStack.pop();
        let op = opsStack.pop();
        valueStack.push(operate(left, op, right));
    }

    return valueStack.pop();

}

function sendToDisplay(displayText) {
    if (displayText.length <= 13) {
        display.textContent += displayText;
    } else {
        display.textContent = Number.parseFloat(displayText).toExponential(3);
    }
}


numericKeys.forEach(btn => {
    btn.addEventListener("click", () => {
        if (display.textContent === "Error") {
            display.textContent = "";
        }
        if (display.textContent.length < 13) {
            sendToDisplay(btn.textContent)
        }
    })
})

operatorKeys.forEach(btn => {
    btn.addEventListener("click", () => {
        const operator = btn.textContent;
        const lastChar = display.textContent[display.textContent.length - 1];

        if (display.textContent.length === 0 && (operator === '+' || operator === '-' || operator === '*' || operator === '/')) return;

        // Prevent duplicate operators or operator at start
        // if lastchar is an operator then avoid adding another operator symbol


        if (!"+-*/".includes(lastChar)) {
            sendToDisplay(operator);
        }
    })
})

document.querySelector("#clearKey").addEventListener("click", acKey);
document.querySelector("#deleteKey").addEventListener("click", delKey);
document.querySelector("#equalKey").addEventListener("click", equalKey);
document.querySelector("#pointKey").addEventListener("click", () => {
    const expr = display.textContent;
    const lastNumber = expr.split(/[\+\-\*\/]/).pop();
    if (!lastNumber.includes(".")) {
        sendToDisplay(".");
    }
})