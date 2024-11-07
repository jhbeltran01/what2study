import React, { useState, useEffect, createContext } from 'react'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import Form from './Form'
import { useDispatch, useSelector } from 'react-redux'
import { setNote } from '@redux/note'
import { setNotes } from '@redux/notes'
import { useNavigate } from 'react-router-dom'
import { NOTE_CONTENT } from '@root/routes/constants'

export const ShowFormContext = createContext()

function Main() {
  const notes = useSelector(state => state.notes.value)
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get(`${apiRootURL}/notes/`)
      .then(response => {
        dispatch(setNotes(response.data.results))
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const redirectToNoteContent = (note) => {
    dispatch(setNote(note))
    navigate(NOTE_CONTENT)
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
          {notes.map(note =>
            <button
              onClick={() => redirectToNoteContent(note)}
              key={note.slug}
            >
              {note.name}
            </button>
          )}
        </div>
        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
