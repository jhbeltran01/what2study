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
  const [searchQuery, setSearchQuery] = useState('')
  const todos = useSelector(state => state.todos.value)
  const [showForm, setShowForm] = useState(false)
  const [isDeleteMode, setIsDeleteMode] = useState(false) 
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

  const handleDeleteTodo = async (todoId) => {
    const confirmed = window.confirm("Are you sure you want to delete this to do?")
    if (confirmed) {
      try {
        await axios.delete(`${apiRootURL}/todos/${todoId}/`)
        alert('Todo deleted successfully.')
        const response = await axios.get(`${apiRootURL}/todos/`)
        dispatch(setTodos(response.data.results))
      } catch (error) {
        console.error('Error deleting todo:', error)
        alert('An error occurred while trying to delete the todo.')
      }
    }
  }

  const filteredTodos = todos.filter(todo =>
    todo.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderRows = () => {
    const rows = []
    let todoIndex = 0
    while (todoIndex < filteredTodos.length) {
      const currentRow = []
      const rowCount = rows.length % 2 === 0 ? 5 : 4

      for (let j = 0; j < rowCount && todoIndex < filteredTodos.length; j++, todoIndex++) {
        const todo = filteredTodos[todoIndex]
        currentRow.push(
          <div
            key={todoIndex}
            id={`todo-${todo.id}`} 
            className={`note-card-container ${isDeleteMode ? 'wiggle' : ''}`} 
          >
            <div className="note-card">
              <button
                className="note-card-button"
                onClick={() => redirectToTodoContent(todo)}
              >
                <h3>{todo.name}</h3>
              </button>
              {isDeleteMode && (
                <button
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="delete-note-icon"
                >
                  🗑️ 
                </button>
              )}
            </div>
          </div>
        )
      }

      rows.push(
        <div key={rows.length} className="notes-row">
          {currentRow}
        </div>
      )
    }
    return rows
  }

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div>
        <div className="flex">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search..."
            className="search-bar2"
          />
          <div className="flex gap-2">
            {!isDeleteMode && (
              <button
                onClick={() => setShowForm(true)}
                className="btn-add"
              >
                Add
              </button>
            )}

            {!isDeleteMode && (
              <button
                onClick={() => setIsDeleteMode(true)}
                className="btn-delete"
              >
                Delete
              </button>
            )}

            {isDeleteMode && (
              <button
                onClick={() => setIsDeleteMode(false)}
                className="btn-cancel"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="notes-list">
          {filteredTodos.length > 0 ? renderRows() : <p>No todos available</p>}
        </div>

        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
