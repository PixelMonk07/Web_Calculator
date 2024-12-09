// Select necessary elements
const screen = document.querySelector("#screen");
const buttons = document.querySelectorAll(".btn");
const operatorButtons = document.querySelectorAll(".btn-operator");
const equalsButton = document.querySelector("#equals");
const clearButton = document.querySelector("#clear");

let current_value = "0";
let firstOperand = null;
let currentOperand = null;
let operatorStack = [];
let valueStack = [];
let operatorButtonClicked = false;

// Update the screen with the current value
function updateScreen() {
  screen.textContent = current_value;
}

// Reset the calculator state
function reset_calc() {
  current_value = "0";
  firstOperand = null;
  currentOperand = null;
  operatorStack = [];
  valueStack = [];
  operatorButtonClicked = false;
  updateScreen();
}

// Handle number button clicks
function handleNumber(number) {
  if (operatorButtonClicked) {
    current_value = number; // Start a new number after an operator
    operatorButtonClicked = false;
  } else if (current_value === "0") {
    current_value = number; // Replace leading zero
  } else {
    current_value += number; // Append the digit
  }
  updateScreen();
}

// Handle decimal input
function handleDecimal() {
  if (!current_value.includes(".")) {
    current_value += ".";
    updateScreen();
  }
}

// Perform calculation based on operator precedence
function performCalculation() {
  while (operatorStack.length > 0) {
    const operator = operatorStack.pop();
    const b = valueStack.pop();
    const a = valueStack.pop();

    let result;
    switch (operator) {
      case "+":
        result = a + b;
        break;
      case "-":
        result = a - b;
        break;
      case "*":
        result = a * b;
        break;
      case "/":
        if (b === 0) {
          screen.textContent = "Error";
          reset_calc();
          return;
        }
        result = a / b;
        break;
      default:
        return;
    }
    valueStack.push(result); // Push the result back onto the value stack
  }
}

// Handle operator button clicks
function handleOperator(operator) {
  const currentNumber = parseFloat(current_value);

  // Push the current value into the value stack
  if (!operatorButtonClicked) {
    valueStack.push(currentNumber);
  }

  // Handle operator precedence: if the operator is *, /, calculate immediately
  if (operator === "*" || operator === "/") {
    while (
      operatorStack.length > 0 &&
      (operatorStack[operatorStack.length - 1] === "*" ||
        operatorStack[operatorStack.length - 1] === "/")
    ) {
      performCalculation();
    }
  } else {
    // For + and -, calculate previous higher precedence operators first
    while (operatorStack.length > 0) {
      performCalculation();
    }
  }

  // Push the current operator onto the operator stack
  operatorStack.push(operator);
  operatorButtonClicked = true; // Mark operator as clicked
  updateScreen();
}

// Add event listeners to number buttons
buttons.forEach((button) => {
  if (button.dataset.number) {
    button.addEventListener("click", () => {
      handleNumber(button.dataset.number);
    });
  }
});

// Add event listeners to operator buttons
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    handleOperator(button.dataset.operator);
  });
});

// Handle equals button click
equalsButton.addEventListener("click", () => {
  const currentNumber = parseFloat(current_value);
  if (!operatorButtonClicked) {
    valueStack.push(currentNumber);
  }
  performCalculation(); // Calculate the final result
  if (valueStack.length === 1) {
    current_value = valueStack.pop().toString();
    updateScreen();
  }
});

function handleBackspace() {
  if (current_value.length > 1) {
    current_value = current_value.slice(0, -1); // Remove the last character
  } else {
    current_value = "0"; // Reset to "0" if only one digit remains
  }
  updateScreen();
}

// Add event listener to the backspace button
const backspaceButton = document.querySelector("#backspace");
backspaceButton.addEventListener("click", handleBackspace);

function handlePercentage() {
  current_value = (parseFloat(current_value) / 100).toString();
  updateScreen();
}

// Add event listener to the percentage button
const percentageButton = document.querySelector("#percentage");
percentageButton.addEventListener("click", handlePercentage);


// Handle clear button click
clearButton.addEventListener("click", reset_calc);
