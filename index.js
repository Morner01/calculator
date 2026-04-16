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
    if (previousKeyType === 'calculate') {
      return keyContent
    }
    return displayedNum === '0' || previousKeyType === 'operator'
      ? keyContent
      : displayedNum + keyContent
  }
  
  if (keyType === 'decimal') {
    if (previousKeyType === 'calculate') return '0.'
    if (!displayedNum.includes('.')) return displayedNum + '.'
    return displayedNum
  }
  
  if (keyType === 'operator') {
    if (firstValue && operator && previousKeyType !== 'operator') {
      return calculate(firstValue, operator, displayedNum)
    }
    return displayedNum
  }
  
  if (keyType === 'clear') return 0
  
  if (keyType === 'calculate') {
    if (firstValue && operator && previousKeyType !== 'calculate') {
      return calculate(firstValue, operator, displayedNum)
    }
    if (firstValue && operator && previousKeyType === 'calculate' && modValue) {
      return calculate(displayedNum, operator, modValue)
    }
    return displayedNum
  }
  
  return displayedNum
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  calculator.dataset.previousKeyType = keyType
  
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
  if (keyType === 'operator') {
    key.classList.add('is-depressed')
    calculator.dataset.operator = key.dataset.action
    
    const firstValue = calculator.dataset.firstValue
    const operator = calculator.dataset.operator
    const previousKeyType = calculator.dataset.previousKeyType
    
    if (firstValue && operator && previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      calculator.dataset.firstValue = calculatedValue
    } else if (previousKeyType !== 'calculate') {
      calculator.dataset.firstValue = displayedNum
    }
  }
  
  if (keyType === 'clear') {
    if (key.textContent === 'AC') {
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    } else {
      key.textContent = 'AC'
    }
  }
  
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    if (clearButton.textContent !== 'AC') {
      clearButton.textContent = 'CE'
    }
  }
  
  if (keyType === 'calculate') {
    const firstValue = calculator.dataset.firstValue
    const modValue = calculator.dataset.modValue
    const previousKeyType = calculator.dataset.previousKeyType
    
    if (firstValue && previousKeyType === 'calculate') {
      calculator.dataset.modValue = modValue || displayedNum
    } else if (firstValue) {
      calculator.dataset.modValue = displayedNum
    }
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
  if (keyType === 'operator') key.classList.add('is-depressed')
  
  if (keyType === 'clear' && key.textContent !== 'AC') {
    key.textContent = 'AC'
  }
  
  if (keyType !== 'clear') {
    const clearButton = calculator.querySelector('[data-action=clear]')
    if (clearButton.textContent !== 'AC') {
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