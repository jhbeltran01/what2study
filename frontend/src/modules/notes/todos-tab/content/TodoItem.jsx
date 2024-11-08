import PropTypes from 'prop-types'
import React from 'react'

function TodoItem({todoItem}) {
  return (
    <div className='flex justify-between'>
      <p>{todoItem.text}</p>
      <div>⋮</div>
    </div>
  )
}

TodoItem.propTypes = {
  todoItem: PropTypes.shape({
    text: PropTypes.string.isRequired
  })
}

export default TodoItem
