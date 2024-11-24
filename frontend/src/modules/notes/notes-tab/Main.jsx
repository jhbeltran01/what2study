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

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    const options = {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }
    return date.toLocaleString('en-US', options).replace(',', '')
  }

  return (
    <ShowFormContext.Provider value={[showForm, setShowForm]}>
      <div>
        <div className='text-right'>
          <button
            className='btn-add3'
            onClick={() => setShowForm(true)}
          >
            Add
          </button>
        </div>

        <div className=''>
          <div className=''>
          </div>
            <div className='note-container'>
              {notes.map(note =>
                  <button 
                    className="note-button" 
                    onClick={() => redirectToNoteContent(note)} 
                    key={note.slug}
                  >
                    <div className="note-title-container">
                      <div className="note-title">{note.name}</div>
                      <div className="note-timestamp">
                        {formatTimestamp(note.created_at)}
                      </div>
                    </div>
                    <div className="note-content">
                      {note.content && note.content.trim() !== "" 
                        ? note.content 
                        : "Content goes here..."}
                    </div>
                  </button>
              )}
            </div>
          </div>
          {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
