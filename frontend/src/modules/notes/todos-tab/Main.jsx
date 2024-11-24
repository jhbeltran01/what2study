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
  const [searchQuery, setSearchQuery] = useState('') // State for search query
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
  }, [dispatch])

  const redirectToTodoContent = (todo) => {
    dispatch(setTodo(todo))
    navigate(TODOS_CONTENT)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value) 
  }

  const filteredTodos = todos.filter(todo =>
    todo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div>
        <div className='flex justify-between items-center'>
        <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch} 
            placeholder="Search..." 
            className="search-bar2"
          />
          <button
            onClick={() => setShowForm(true)}
            className="btn-add"
          >
            Add
          </button>
        </div>
        
        <div className='todo-container'>
  {filteredTodos.map(todo =>
    <button 
      className="todo-button" 
      onClick={() => redirectToTodoContent(todo)} 
      key={todo.slug}
    >
      <div className="todo-title-container">
        <div className="todo-title">{todo.name}</div>
      </div>
    </button>
  )}
</div>


        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main