import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTodo, addNewTodoItem } from '@redux/todo'
import TodoItem from './TodoItem'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Main() {
  const todos = useSelector(state => state.todos.value)
  const todo = useSelector(state => state.todo.value)
  const [itemText, setItemText] = useState('')

  const dispatch = useDispatch()

  const getTodo = (event) => {
    const selectedTodoSlug = event.target.value
    const todo = todos.filter(todo => todo.slug == selectedTodoSlug)[0]
    dispatch(setTodo(todo))
  }

  const addTodoItem = () => {
    if (itemText.trim()) {
      axios
        .post(
          `${apiRootURL}/todos/${todo.slug}/items/`,
          { text: itemText }
        )
        .then(response => {
          dispatch(addNewTodoItem(response.data))
          setItemText('')
        })
        .catch(err => {
          console.log(err)
        })
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodoItem()
    }
  }

  return (
    <div className="container-4">
      <div className="input-container">
        <select
          className="todos-dropdown"
          defaultValue={todo.slug}
          onChange={getTodo}
        >
          {todos.map(todo => (
            <option value={todo.slug} key={todo.slug}>
              {todo.name}
            </option>
          ))}
        </select>

        <input
          value={itemText}
          type="text"
          onChange={(e) => setItemText(e.target.value)}
          onKeyDown={handleKeyPress} 
          className="add-todo"
          placeholder="Add a new to do"
        />

        <button
          onClick={addTodoItem}
          className="btn-add3"
        >
          Add
        </button>
      </div>

      <div className="todo-items-container">
        {todo.items.map(todoItem => (
          <TodoItem todoItem={todoItem} key={todoItem.slug} />
        ))}
      </div>
    </div>
  )
}

export default Main