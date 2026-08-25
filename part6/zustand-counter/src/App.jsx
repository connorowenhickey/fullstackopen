import Display from './components/Display'
import Controls from './components/Controls'
import { useState } from 'react'

const App = () => {
  const [counter, setCounter] = useState(0)

  return (
    <>
      <Display counter={counter} />
      <Controls setCounter={setCounter} />
    </>
  )
}

export default App