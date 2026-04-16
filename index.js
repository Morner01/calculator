const calculator = document.querySelector('.calculator')
const display = document.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') {
    if (secondNum === 0) return 'Error'
    return firstNum / secondNum
  }
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
    return '0'
  }
  
  if (keyType === 'calculate') {
    if (!operator || firstValue === undefined || firstValue === '') {
      return displayedNum
    }
    if (previousKeyType === 'calculate') {
      const result = calculate(displayedNum, operator, modValue || displayedNum)
      return result === 'Error' ? 'Error' : Math.round(result * 1000000) / 1000000
    }
    const result = calculate(firstValue, operator, displayedNum)
    return result === 'Error' ? 'Error' : Math.round(result * 1000000) / 1000000
  }
  
  return displayedNum
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  calculator.dataset.previousKeyType = keyType
  
  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    
    const firstValue = calculator.dataset.firstValue
    const operator = calculator.dataset.operator
    const previousKeyType = calculator.dataset.previousKeyType
    
    if (!firstValue || firstValue === '') {
      calculator.dataset.firstValue = displayedNum
    } else if (previousKeyType !== 'operator' && previousKeyType !== 'calculate') {
      calculator.dataset.firstValue = calculatedValue
    }
  }
  
  if (keyType === 'clear') {
    if (display.textContent === '0') {
      calculator.dataset.firstValue = ''
      calculator.dataset.modValue = ''
      calculator.dataset.operator = ''
      calculator.dataset.previousKeyType = ''
    }
  }
  
  if (keyType === 'calculate') {
    if (calculator.dataset.firstValue && calculator.dataset.firstValue !== '') {
      calculator.dataset.modValue = displayedNum
      if (calculator.dataset.operator) {
        calculator.dataset.firstValue = calculatedValue
      }
    }
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key)
  
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))
  
  if (keyType === 'operator') {
    key.classList.add('is-depressed')
  }
  
  const clearButton = calculator.querySelector('[data-action=clear]')
  if (keyType === 'clear') {
    if (display.textContent === '0') {
      clearButton.textContent = 'AC'
    } else {
      clearButton.textContent = 'CE'
    }
  } else {
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