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
  const dispatch = useDispatch()

  const addTodo = (event) => {
    event.preventDefault()

    if (name == '') { return }

    axios
      .post(
        `${apiRootURL}/todos/`,
        {name: name}
      )
      .then(response => {
        updateUIOnAddTodo(response.data)
        setName('')
        setShowForm(false)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateUIOnAddTodo = (todo) => {
    dispatch(setTodos([todo, ...todos]))
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

          <button type='submit' className='form-submit'>Add</button>
        </form>
      </div>
    </div>
  )
}

export default Form