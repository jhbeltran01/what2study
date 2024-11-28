import axios from 'axios'
import React, { useContext, useState } from 'react'
import { ShowFormContext } from './Main'
import { apiRootURL } from '@root/globals'
import { useDispatch, useSelector } from 'react-redux'
import { setNotes } from '@redux/notes'

function Form() {
  const notes = useSelector(state => state.notes.value)
  const setShowForm = useContext(ShowFormContext)[1]
  const [name, setName] = useState('')
  const [message, setMessage] = useState({ text: '', type: '' })
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()

    if (name === '') {
      setMessage({ text: 'Title is required', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    const existingNote = notes.find(note => note.name.toLowerCase() === name.toLowerCase())
    if (existingNote) {
      setMessage({ text: 'Note with this title already exists', type: 'error' })
      closeMessageAfterTimeout()
      return
    }

    axios
      .post(
        `${apiRootURL}/notes/`,
        { name: name },
      )
      .then(response => {
        updateUIOnAddNote(response.data)
        setMessage({ text: 'Note added successfully', type: 'success' })
        closeMessageAfterTimeout()
        setShowForm(false)
      })
      .catch(err => {
        setMessage({ text: 'Failed to add note', type: 'error' })
        closeMessageAfterTimeout()
        console.log(err)
      })
  }

  const updateUIOnAddNote = (note) => {
    dispatch(setNotes([note, ...notes]))
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

        <form onSubmit={addNote} className='form-container'>
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
