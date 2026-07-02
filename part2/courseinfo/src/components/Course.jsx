const Header = (props) => (
  <>
    <h2>{props.title}</h2>
  </>
)

const Part = (props) => (
  <>
    <p>{props.parts.name}: {props.parts.exercises}</p>
  </>
)

const Total = (props) => (
  <>
    <p>Number of exercises: {props.parts.reduce((sum, curr) => sum + curr.exercises, 0)}</p>
  </>
)


const Course = (props) => (
  <div>
    <Header title={props.course.name}/>
    
    <div>
      {props.course.parts.map(part => (
        <Part key={part.id} parts={part} />
      ))}
    </div>
    <Total parts={props.course.parts} />
  </div>

)

export default Course
