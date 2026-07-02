const Note = (props) => (
  <>
    <li>{props.name}: {props.number}
      <button onClick={() => props.onDelete(props.id)}>delete</button>
    </li>
  </>
)

const Persons = (props) => (
  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
    {props.persons.map(person => 
      <Note key={person.id} name={person.name} number={person.number} id={person.id} onDelete={props.onDelete} />
    )}
  </ul>
)

export default Persons