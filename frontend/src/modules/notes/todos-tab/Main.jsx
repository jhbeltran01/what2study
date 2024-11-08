import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import { useDispatch, useSelector } from 'react-redux'
import { setTodos } from '@redux/todos'
import Form from './Form'
import { setTodo } from '@redux/todo'
import { useNavigate } from 'react-router-dom'
import { TODOS_CONTENT } from '@root/routes/constants'

export const ShowFormContext = createContext()

function Main() {
  const todos = useSelector(state => state.todos.value)
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${apiRootURL}/todos/`)
      .then(response => {
        dispatch(setTodos(response.data.results))
      })
  }, [])

  const redirectToTodoContent = (todo) => {
    dispatch(setTodo(todo))
    navigate(TODOS_CONTENT)
  }

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div>
        <div className='flex gap-[10px]'>
          <button
            onClick={() => setShowForm(true)}
          >
            Add
          </button>
          {todos.map(todo =>
            <button
              key={todo.slug}
              onClick={() => redirectToTodoContent(todo)}
            >
              {todo.name}
            </button>
          )}
        </div>
        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
