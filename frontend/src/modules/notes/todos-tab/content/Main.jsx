import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setTodo } from '@redux/todo'
import { setTodos } from '@redux/todos'
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
    axios
      .post(
        `${apiRootURL}/todos/${todo.slug}/items/`,
        {text: itemText}
      )
      .then(response => {
        updateUIOnAddTodoItem(todo.slug, response.data)
        setItemText('')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateUIOnAddTodoItem = (todoSlug, newItem) => {
    const tempTodos = todos.map(todo => {
      if (todo.slug != todoSlug) { return todo }

      const tempTodo = {...todo}
      tempTodo.items = [newItem, ...todo.items]

      dispatch(setTodo(tempTodo))

      return tempTodo
    })
    dispatch(setTodos(tempTodos))
  }

  return (
    <div className='container-1'>
      <div>
        <select
          defaultValue={todo.slug}
          onChange={getTodo}
        >
          {todos.map(todo =>
            <option
              value={todo.slug}
              key={todo.slug}
            >
              {todo.name}
            </option>
          )}
        </select>
      </div>

      <div>
        <div>
          <input 
            value={itemText}
            type="text" 
            onChange={(e) => setItemText(e.target.value)}
          />
          <button
            onClick={addTodoItem}
          >
            Add
          </button>
        </div>

        <div>
          {todo.items.map(todoItem => <TodoItem todoItem={todoItem}  key={todoItem.slug}/>)}
        </div>
      </div>
    </div>
  )
}

export default Main
