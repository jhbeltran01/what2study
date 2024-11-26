import axios from 'axios'
import React, { useState } from 'react'
import { apiRootURL } from '@root/globals'
import { useDispatch, useSelector } from 'react-redux'
import { setNotes } from '@redux/notes'
import PropTypes from 'prop-types'

function CreateNoteForm({setShowForm}) {
  const notes = useSelector(state => state.notes.value)
  const subject = useSelector(state => state.subject.value)
  const [name, setName] = useState('')
  const dispatch = useDispatch()

  const addNote = (event) => {
    event.preventDefault()

    if (name == '') { return }

    axios
      .post(
        `${apiRootURL}/subjects/${subject.slug}/notes/`,
        {name: name},
      )
      .then(response => {
        updateUIOnAddNote(response.data)
        setShowForm(false)
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  const updateUIOnAddNote = (note) => {
    dispatch(setNotes([note, ...notes]))
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

        <form onSubmit={addNote}>
          <div>
            <label htmlFor="name">Title</label> <br />
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

CreateNoteForm.propTypes = {
  setShowForm: PropTypes.func.isRequired,
}

export default CreateNoteForm