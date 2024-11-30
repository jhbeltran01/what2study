import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { apiRootURL } from '@root/globals'

function Form({ subjectsState, showFormState, setMessage, closeMessageAfterTimeout }) {
  const [subjects, setSubjects] = subjectsState
  const setShowForm = showFormState[1]
  const [name, setName] = useState('')
  const [message, setMessageState] = useState({ text: '', type: '' }) 

  const handleMessage = (msg) => {
    setMessageState(msg)
    setMessage(msg)  
  }

  const createSubject = (event) => {
    event.preventDefault()

    if (!name) {
      handleMessage({ text: 'Subject name is required', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    const existingSubject = subjects.find(subject => subject.name.toLowerCase() === name.toLowerCase())
    if (existingSubject) {
      handleMessage({ text: 'Subject already exists', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    axios
      .post(`${apiRootURL}/subjects/`, { name: name })
      .then(response => {
        setSubjects([response.data, ...subjects])
        setName('')
        handleMessage({ text: 'Subject added successfully', type: 'success' })
        closeMessageAfterTimeout()

        setShowForm(false)  
      })
      .catch(err => {
        console.error('API Request Error:', err) 
      })
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

        <form onSubmit={createSubject} className='form-container'>
          <div className='form-group'>
            <label htmlFor="name" className='form-label'>Class</label> <br />
            <input
              value={name}
              className='text-black input-title'
              type="text"
              id="name"
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a class"
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

Form.propTypes = {
  subjectsState: PropTypes.array.isRequired,
  showFormState: PropTypes.array.isRequired,
  setMessage: PropTypes.func.isRequired,
  closeMessageAfterTimeout: PropTypes.func.isRequired
}

export default Form