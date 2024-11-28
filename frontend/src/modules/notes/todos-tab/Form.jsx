import React, { useContext, useState } from 'react'
import { ShowFormContext } from './Main'
import { apiRootURL } from '@root/globals'
import axios from 'axios'
import { setTodos } from '@redux/todos'
import { useDispatch, useSelector } from 'react-redux'

function Form() {
  const todos = useSelector(state => state.todos.value)
  const setShowForm = useContext(ShowFormContext)[1]
  const [name, setName] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const dispatch = useDispatch()

  const addTodo = (event) => {
    event.preventDefault()

    if (name === '') {
      setMessage({ text: 'Title is required', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    const existingTodo = todos.find(todo => todo.name.toLowerCase() === name.toLowerCase())
    if (existingTodo) {
      setMessage({ text: 'To do with this title already exists', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    axios
      .post(
        `${apiRootURL}/todos/`,
        { name: name }
      )
      .then(response => {
        updateUIOnAddTodo(response.data)
        setMessage({ text: 'To do added successfully', type: 'success' })
        closeMessageAfterTimeout()
        setName('')
        setShowForm(false)
      })
      .catch(err => {
        setMessage({ text: 'Failed to add to do', type: 'error' })
        closeMessageAfterTimeout()
        console.log(err)
      })
  }

  const updateUIOnAddTodo = (todo) => {
    dispatch(setTodos([todo, ...todos]))
  }

  const closeMessageAfterTimeout = () => {
    setTimeout(() => {
      setMessage({ text: '', type: '' })
    }, 5000) 
  }

  return (
    <div className='overlay-1 flex justify-center items-center text-white'>
      <div className='form-1'>
        <button
          onClick={() => setShowForm(false)}
          className="close-btn"
        >
          x
        </button>

        <form onSubmit={addTodo} className='form-container'>
          <div className='form-group'>
            <label htmlFor="name" className='form-label'>Title</label> <br />
            <input
              className='text-black input-title'
              value={name}
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a title"
            />
          </div>

          {message.text && (
            <div className={`message ${message.type}`}>
              {message.text}
            </div>
          )}

          <button type='submit' className='form-submit'>Add</button>
        </form>
      </div>
    </div>
  )
}

export default Form
