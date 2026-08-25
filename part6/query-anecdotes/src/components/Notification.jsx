import useNotify from '../hooks/useNotify'

const Notification = () => {
  const { notification } = useNotify()

  if (!notification) {
    return null
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1
  }

  return (
    <div
      style={style}
      data-testid="notification"
    >
      {notification}
    </div>
  )
}

export default Notification