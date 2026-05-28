import { useState } from 'react'

const Button = (props) => {
  return (
    <button onClick={props.onClick}>{props.text}</button>
  )
}

const StatisticLine= (props) => {
  return (
    <tr>
      <td>{props.text}</td>
      <td>{props.value}</td>
    </tr>
  ) 
}

const Statistics = (props) => {
  return (
    <table>
      <tbody>
        <StatisticLine text='Good' value={props.good}/>
        <StatisticLine text='Neutral' value={props.neutral}/>
        <StatisticLine text='Bad' value={props.bad}/>
        <StatisticLine text='Total' value={props.total}/>
        <StatisticLine text='Average' value={props.average}/>
        <StatisticLine text='Positive Percentage' value={props.positive_percent}/>
      </tbody>
    </table>
  ) 
}


const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const total = good + neutral + bad
  const average = total === 0 ? 0 : (good-bad)/total 
  const positive_percent = total === 0 ? 0 : (good*100)/total


  const handleGood = () => {
    const updatedGood = good + 1
    setGood(updatedGood)
  }

  const handleNeutral = () => {
    const updatedNeutral = neutral + 1
    setNeutral(updatedNeutral)
  }

  const handleBad = () => {
    const updatedBad = bad + 1
    setBad(updatedBad)  
  }

  return (
    <div>
      <h1>Cafe Feedback Form</h1>

      <Button onClick={handleGood} text='Good'/>
      <Button onClick={handleNeutral} text='Neutral'/>
      <Button onClick={handleBad} text='Bad'/>

      <h2>Feedback statistics: </h2>
      {total === 0 
        ? <div>No feedback given</div>
        : <>
          <Statistics good={good} neutral={neutral} bad={bad} total={total} average={average} positive_percent={positive_percent}/>
        </>
      }
      
    </div>
  )
}

export default App
