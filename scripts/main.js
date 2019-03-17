// I'm adding this comment to test my SSH connection
// GLOBAL VARIABLES

const maxDisplaySize = 9;

// Tracking Variables

var displayValue = 0;
var workingNumber = "";
var operand = 0;
var operator = null;
var memory = 0;
var isCalculationError = false

//Enums
const binaryOperatorsEnum = {
    ADDITION: "+",
    SUBTRACTION: "-",
    MULTIPLICATION: "×", 
    DIVISION: "÷",
    EXPONENT: "x^y",
};

const unaryOperatorsEnum = {
	PERCENT: "%",
    SQROOT: "√",
    CUBEROOT: "3√",
    FACTORIAL: "!",
}

const calculatorFunctionsEnum = {
    ALLCLEAR: "AC",    
    EQUALS: "=",
    NEGATION: "+/-",
    MEMORY: "M",
    MEMORYPLUS: "M+",
    MEMORYMINUS: "M-",
    MEMORYCLEAR: "MC",
    BACKSPACE: "Bksp",
}

//Document Variables

const buttons = document.querySelectorAll('button');
const display = document.getElementById('display').querySelector('p');
const memoryButton = document.querySelector('#M');

// const funcButtons = document.querySelectorAll('.function')

//FUNCTIONS

//Binary Operations

function add(a,b) {
	let floatA = parseFloat(a);
	let floatB = parseFloat(b);
	
	var result = String(floatA + floatB);
	if (result.substr(result.length - 2, 2) == ".0") {
		result = parseInt(result);
	} else {
		result = parseFloat(result);
	}
    return result;
}

function subtract(a,b) {
    return a - b;
}

function multiply(a,b) {
    return a * b;
}

function divide(a,b) {
    if (b == 0) {
    	isCalculationError = true;
        return "NO RESULT FOR YOU!";
    }
    return a / b;
}

function pow(a,b) {
	return Math.pow(a,b);
}

// unary Operations

function squareRoot(a) {
	if (a < 0) {
		isCalculationError = true;
		return "IMAGINARY NUMBER"
	}
	return Math.sqrt(a);
}


function percent(a) {
	return multiply(a,0.01);
}

function factorial(a) {
	switch (true) {
		case (a == 0):
			return 1;
			break;
		case (a < 0):
		case (parseInt(a) != a):
			isCalculationError = true;
			return "Err";
			break;
		default:
			var result = 1;
			for (i = a; i > 0; i--) {
				result = result * i;
			}
			return result;
	}
}

function negate(a) {
	return multiply(a,-1)
}

function cuberoot(a) {
	return Math.cbrt(a);
}

// Calculator Functions

function binaryOperation(a,b,operator) {
    a = Number(a);
    b = Number(b);
    switch (operator) {
        case binaryOperatorsEnum.ADDITION: 
            workingNumber = add(a,b);
            break;
        case binaryOperatorsEnum.SUBTRACTION:
            workingNumber = subtract(a,b);
            break;
        case binaryOperatorsEnum.MULTIPLICATION:
            workingNumber = multiply(a,b);
            break;
        case binaryOperatorsEnum.DIVISION: 
            workingNumber = divide(a,b);
            break;
        case binaryOperatorsEnum.EXPONENT:
        	workingNumber = pow(a,b);
        default:
            break;
    }

    updateDisplay()
}

function unaryOperation(a,operator) {
	switch(operator) {
		case unaryOperatorsEnum.PERCENT:
			workingNumber = percent(a);
			break;
		case unaryOperatorsEnum.SQROOT:
			workingNumber = squareRoot(a);
			break;
		case unaryOperatorsEnum.CUBEROOT:
			workingNumber = cuberoot(a)
			break;
		case unaryOperatorsEnum.FACTORIAL:
			workingNumber = factorial(a);
			break;
		default:
            break;
    }

    updateDisplay()
}

function getExponentNotation(val) {
	if (val < 1000000 && val > 0.0000001) {
		return val
	}
	
	var str = String(val);
	
	if (val > 1) {
		if (str.includes(".")) {
			let decimal = str.indexOf(".");
			str = str.substr(0, decimal);
		}
		let exp = str.length - 1;
		if (exp > 9999) {
			evaluateButtonPress(calculatorFunctionsEnum.ALLCLEAR);
			return "This number is too big";
		}
		str = `${str.substr(0, 1)}.${str.substr(1, 4)}e${exp}`
		
	} else {
		console.log(str);
		str = str.substr(2);
		var foundValue = false
		var exp = 0;
		do {
			let checkValue = str.substr(exp, 1);
			if (checkValue != "0") {
				foundValue = true
			}
			exp++;
		}
		while (foundValue = false)
		str = `${str.substr(exp, 1)}.${str.substr(1, 4)}e-${exp + 1}`
	}
	
	
	return str;
}

function evaluateButtonPress(val) {
	console.log(`Evaluating ${val}`)
	
    switch (val) {
        // Number Keys
        case ".":
            if (workingNumber == "") {
                workingNumber = "0"
            } else if (workingNumber.includes(".")) {
                break;
            }
        case "0":
        case "1":
        case "2":
        case "3":
        case "4":
        case "5":
        case "6":
        case "7":
        case "8":
        case "9":
            numberPressed(val);
            break;
        // Binary Operations
        case binaryOperatorsEnum.ADDITION:
        case binaryOperatorsEnum.SUBTRACTION:
        case binaryOperatorsEnum.MULTIPLICATION:
        case binaryOperatorsEnum.DIVISION:
		case binaryOperatorsEnum.EXPONENT:        
            console.log(`It's a Binary Operator: ${val}`)
			if (operator != null) {
				binaryOperation(operand,displayValue,operator);
			} 
			operand = displayValue
			if (isNaN(operand)) {
				operand = 0;	
			}
			operator = val
			workingNumber = "";
            break;
        // Unary Operations
		case unaryOperatorsEnum.PERCENT:
		case unaryOperatorsEnum.SQROOT:
		case unaryOperatorsEnum.CUBEROOT:
		case unaryOperatorsEnum.FACTORIAL:
			console.log(`It's a Unary Operator: ${val}`)
			unaryOperation(displayValue,val);
			updateDisplay()
			workingNumber = "";
			break;	
		// Calculator Functions
		case calculatorFunctionsEnum.EQUALS:
			if (operator == null) {
                workingNumber = display.textContent;
                updateDisplay();
                workingNumber = "";
                operand = null;
                break;
			} else {
				binaryOperation(operand,displayValue,operator);
			}
			updateDisplay()
			operator = null;
			workingNumber = "";
			operand = null;
			break;
        case calculatorFunctionsEnum.ALLCLEAR:
            workingNumber = "";
            operand = null;
            operator = null;
            updateDisplay();
            break;
        case calculatorFunctionsEnum.NEGATION:
            workingNumber = negate(workingNumber);
            updateDisplay()
            break;
        case calculatorFunctionsEnum.BACKSPACE:
        	workingNumber = workingNumber.substr(0, workingNumber.length - 1);
        	updateDisplay();
        	break;
        case calculatorFunctionsEnum.MEMORY:
        	workingNumber = memory;
        	updateDisplay();
        	workingNumber = ""
			break;
        case calculatorFunctionsEnum.MEMORYPLUS:
        	memory = add(memory,workingNumber);
        	console.log(memory);
        	setMemoryIndicator();
        	workingNumber = ""
        	break;
        case calculatorFunctionsEnum.MEMORYMINUS:
        	memory = subtract(memory,workingNumber);
        	console.log(memory);
        	setMemoryIndicator();
        	workingNumber = ""
        	break;
        case calculatorFunctionsEnum.MEMORYCLEAR:
        	memory = 0;
        	setMemoryIndicator();
        	break;
        default:
            break;
    }

	if (isCalculationError == true) {
		workingNumber = ""
		operand = null
		operator = null
		isCalculationError = false;
	}
	
    console.log(`workingNumber: ${workingNumber}, displayValue: ${displayValue}, operand: ${operand}, operator: ${operator}`);
}

function evaluateKeyPress(event) {
	console.log(event.keyCode);
	switch (event.keyCode) {
		default: 
			break;
	}
}

function numberPressed(num) {
    if (workingNumber == "0" && num != ".") {
        workingNumber = "";
    }

    workingNumber = `${workingNumber}${num}`;
    updateDisplay()
}

// UI Functions

function updateDisplay() {
	console.log("workingNumber: ", workingNumber);
    if (workingNumber == "") {
        displayValue = 0;
    } else {
        displayValue = workingNumber;
    }
    
    displayValue = String(displayValue);
    
    console.log('displayValue: ', displayValue);    
  	console.log(`displayValue length ${displayValue.length}`)
    if (displayValue.length > maxDisplaySize) {
		console.log("Too long")
    	if (displayValue > 1000000) {
    		displayValue = getExponentNotation(displayValue);
    	} else if (displayValue < 0.0000001) {
    		displayValue = getExponentNotation(displayValue);
    	} else {
    		displayValue = displayValue.substr(0, maxDisplaySize);
    	}
    }
    
    console.log(workingNumber,displayValue);
    display.textContent = displayValue;
}

function setMemoryIndicator() {
	if (memory == 0) {
		memoryButton.classList.remove("containsMemoryValue");
	} else {
		memoryButton.classList.add("containsMemoryValue");
	}
}
// Startup Script

function initiate() {
    
    for (i = 0; i < buttons.length; i++) {
    
        const btn = buttons[i];
        btn.addEventListener("click", (event) => { 
            const val = event.target.textContent;
            evaluateButtonPress(val);
        })
    }
    
    window.addEventListener('keydown', (event) => {
    	console.log(event.keyCode);
    	evaluateKeyPress(event);	
    })
    updateDisplay(0);
}

initiate();