const calculator = document.querySelector('.calculator')
const display = document.querySelector('.calculator__display')
const keys = calculator.querySelector('.calculator__keys')

let state = {
  currentValue: '0',
  previousValue: null,
  operator: null,
  waitingForOperand: false
}

const roundResult = (value) => {
  return Math.round(value * 1000000) / 1000000
}

const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1)
  const secondNum = parseFloat(n2)
  
  if (operator === 'add') return firstNum + secondNum
  if (operator === 'subtract') return firstNum - secondNum
  if (operator === 'multiply') return firstNum * secondNum
  if (operator === 'divide') {
    if (secondNum === 0) throw new Error('Деление на ноль')
    return firstNum / secondNum
  }
  return secondNum
}

const getKeyType = (key) => {
  const { action } = key.dataset
  if (!action) return 'number'
  if (['add', 'subtract', 'multiply', 'divide'].includes(action)) return 'operator'
  return action
}

const updateDisplay = () => {
  display.textContent = state.currentValue
}

const resetCalculator = (fullReset = true) => {
  if (fullReset) {
    state = {
      currentValue: '0',
      previousValue: null,
      operator: null,
      waitingForOperand: false
    }
  } else {
    state.currentValue = '0'
    state.waitingForOperand = false
  }
  updateDisplay()
}

const handleNumber = (key) => {
  const number = key.textContent
  
  if (state.waitingForOperand || state.currentValue === '0') {
    state.currentValue = number
    state.waitingForOperand = false
  } else {
    state.currentValue += number
  }
  
  updateDisplay()
}

const handleDecimal = () => {
  if (state.waitingForOperand) {
    state.currentValue = '0.'
    state.waitingForOperand = false
  } else if (!state.currentValue.includes('.')) {
    state.currentValue += '.'
  }
  
  updateDisplay()
}

const handleOperator = (key) => {
  const operator = key.dataset.action
  const inputValue = parseFloat(state.currentValue)
  
  if (state.previousValue !== null && state.operator && !state.waitingForOperand) {
    try {
      const result = calculate(state.previousValue, state.operator, inputValue)
      state.currentValue = roundResult(result).toString()
      updateDisplay()
    } catch (error) {
      state.currentValue = 'Ошибка'
      updateDisplay()
      resetCalculator(true)
      return
    }
  }
  
  state.previousValue = parseFloat(state.currentValue)
  state.operator = operator
  state.waitingForOperand = true
}

const handleCalculate = () => {
  if (state.previousValue === null || !state.operator) return
  
  const inputValue = parseFloat(state.currentValue)
  
  try {
    const result = calculate(state.previousValue, state.operator, inputValue)
    state.currentValue = roundResult(result).toString()
    state.previousValue = null
    state.operator = null
    state.waitingForOperand = true
    updateDisplay()
  } catch (error) {
    state.currentValue = 'Ошибка'
    updateDisplay()
    resetCalculator(true)
  }
}

const handleClear = (key) => {
  if (key.textContent === 'AC') {
    resetCalculator(true)
  } else {
    resetCalculator(false)
  }
}

const updateVisualState = (key) => {
  document.querySelectorAll('.key--operator').forEach(btn => {
    btn.classList.remove('is-depressed')
  })
  
  if (getKeyType(key) === 'operator') {
    key.classList.add('is-depressed')
  }
  
  const clearButton = document.querySelector('[data-action=clear]')
  if (state.currentValue !== '0' && !state.waitingForOperand) {
    clearButton.textContent = 'CE'
  } else {
    clearButton.textContent = 'AC'
  }
}

const handleKeyboard = (e) => {
  const key = e.key
  const numberRegex = /^[0-9]$/
  
  if (numberRegex.test(key)) {
    const button = Array.from(document.querySelectorAll('button')).find(
      btn => btn.textContent === key
    )
    if (button) button.click()
  }
  
  if (key === '.') {
    document.querySelector('[data-action="decimal"]')?.click()
  }
  
  if (key === '+' || key === '-' || key === '*' || key === '/') {
    let action
    if (key === '+') action = 'add'
    if (key === '-') action = 'subtract'
    if (key === '*') action = 'multiply'
    if (key === '/') action = 'divide'
    document.querySelector(`[data-action="${action}"]`)?.click()
  }
  
  if (key === 'Enter' || key === '=') {
    document.querySelector('[data-action="calculate"]')?.click()
  }
  
  if (key === 'Escape') {
    document.querySelector('[data-action="clear"]')?.click()
  }
}

const handleButtonClick = (e) => {
  const key = e.target
  if (!key.matches('button')) return
  
  const keyType = getKeyType(key)
  
  switch (keyType) {
    case 'number':
      handleNumber(key)
      break
    case 'decimal':
      handleDecimal()
      break
    case 'operator':
      handleOperator(key)
      break
    case 'calculate':
      handleCalculate()
      break
    case 'clear':
      handleClear(key)
      break
  }
  
  updateVisualState(key)
}

keys.addEventListener('click', handleButtonClick)
window.addEventListener('keydown', handleKeyboard)

resetCalculator(true)