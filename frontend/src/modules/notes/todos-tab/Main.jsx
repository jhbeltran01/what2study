import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { apiRootURL } from '@root/globals'


function Main() {
  const [todos, setTodos] = useState([])

  return (
    <div>
      <button>Add</button>
      {todos.map(todo => 
        <button>Todo</button>
      )}
    </div>
  )
}

export default Main
