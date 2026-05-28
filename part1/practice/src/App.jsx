import { useState } from 'react'

const Display = props => <div>{props.value}</div>

const Button = (props) => (
    <button onClick={props.onClick}>
        {props.text}
    </button>
  )


const App = () => {
  const [value, setValue] = useState(10)

  const setToValue = (newValue) => {
    console.log('value now', newValue)  // print the new value to console
    setValue(newValue)
  }

  //extra brackets needed and extra arrow so that function is returned as result on render. 
  //function is then run when click takes place, not on a re-render. this is what we want.
  const hello = (who) => () => console.log('Hello', who)

  return (
    <div>
      <Display value={value} />
      <Button onClick={() => setToValue(1000)} text="thousand" />
      <Button onClick={() => setToValue(0)} text="reset" />
      <Button onClick={() => setToValue(value + 1)} text="increment" />

    </div>
  )
}

export default App
