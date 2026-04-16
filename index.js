const calculator = document.querySelector('.calculator')
const display = document.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') return firstNum / secondNum
  return secondNum
}

const getKeyType = (key) => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (
    action === 'add' ||
    action === 'subtract' ||
    action === 'multiply' ||
    action === 'divide'
  ) return 'operator'
  return action
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const { action } = key.dataset
  const {
    firstValue,
    modValue,
    operator,
    previousKeyType
  } = state
  
  const keyType = getKeyType(key)
  
  if (keyType === 'number') {
    if (displayedNum === '0' || previousKeyType === 'operator' || previousKeyType === 'calculate') {
      return keyContent
    }
    return displayedNum + keyContent
  }
  
  if (keyType === 'decimal') {
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') {
      return '0.'
    }
    if (!displayedNum.includes('.')) {
      return displayedNum + '.'
    }
    return displayedNum
  }
  
  if (keyType === 'operator') {
    return displayedNum
  }
  
  if (keyType === 'clear') {
    return 0
  }
  
  if (keyType === 'calculate') {
    if (!firstValue || !operator) {
      return displayedNum
    }
    if (previousKeyType === 'calculate') {
      return calculate(displayedNum, operator, modValue || displayedNum)
    }
    return calculate(firstValue, operator, displayedNum)
  }
  
  return displayedNum
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const oldKeyType = calculator.dataset.previousKeyType
  calculator.dataset.previousKeyType = keyType
  
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
  if (keyType === 'operator') {
    key.classList.add('is-depressed')
    calculator.dataset.operator = key.dataset.action
    
    const currentFirstValue = calculator.dataset.firstValue
    const currentOperator = calculator.dataset.operator
    const prevKeyType = calculator.dataset.previousKeyType
    
    if (!currentFirstValue || (prevKeyType !== 'operator' && prevKeyType !== 'calculate')) {
      calculator.dataset.firstValue = displayedNum
    } else if (currentFirstValue && currentOperator && prevKeyType !== 'operator' && prevKeyType !== 'calculate') {
      calculator.dataset.firstValue = calculatedValue
    }
  }
  
  if (keyType === 'number' && oldKeyType === 'calculate') {
    calculator.dataset.firstValue = ''
    calculator.dataset.operator = ''
    calculator.dataset.modValue = ''
  }
  
  if (keyType === 'clear') {
    if (key.textContent === 'AC') {
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    }
  }
  
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    clearButton.textContent = 'CE'
  }
  
  if (keyType === 'calculate') {
    const firstVal = calculator.dataset.firstValue
    const prevKeyType = calculator.dataset.previousKeyType
    
    if (firstVal && prevKeyType === 'calculate') {
      calculator.dataset.modValue = calculator.dataset.modValue || displayedNum
    } else if (firstVal) {
      calculator.dataset.modValue = displayedNum
    }
    
    if (firstVal && calculator.dataset.operator) {
      calculator.dataset.firstValue = calculatedValue
    }
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  
  if (keyType === 'operator') {
    key.classList.add('is-depressed')
  }
  
  if (keyType === 'clear') {
    if (key.textContent !== 'AC') {
      key.textContent = 'AC'
    }
  }
  
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    if (clearButton.textContent !== 'CE') {
      clearButton.textContent = 'CE'
    }
  }
}

keys.addEventListener('click', e => {
  if (e.target.matches('button')) {
    const key = e.target
    const displayedNum = display.textContent
    
    const resultString = createResultString(key, displayedNum, calculator.dataset)
    
    display.textContent = resultString
    updateCalculatorState(key, calculator, resultString, displayedNum)
    updateVisualState(key, calculator)
  }
})