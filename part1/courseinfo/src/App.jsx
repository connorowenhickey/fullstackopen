const Content = (props) => {
  return (
    <div>
      <h1>{props.title}</h1>

      <div>
        <p> {props.parts[0].name}: {props.parts[0].exercises} </p>
        <p> {props.parts[1].name}: {props.parts[1].exercises} </p>
        <p> {props.parts[2].name}: {props.parts[2].exercises} </p>
      </div>
      <p>Number of exercises: {props.parts.reduce((sum, part) => sum+ part.exercises, 0)}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      name: 'Fundamentals of React',
      exercises: 10
    },
    {
      name: 'Using props to pass data',
      exercises: 7
    },
    {
      name: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Content title={course} parts={parts}/>
    </div>
  )
}

export default App