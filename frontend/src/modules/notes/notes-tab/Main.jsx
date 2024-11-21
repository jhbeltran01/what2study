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

function NotesTab() {
  const [searchQuery, setSearchQuery] = useState('')
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
  }, [dispatch])

  const redirectToNoteContent = (note) => {
    dispatch(setNote(note))
    navigate(NOTE_CONTENT)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className='flex justify-between items-center'>
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch} 
            placeholder="Search..." 
            className="search-bar-notes"
          />
          <button
            onClick={() => setShowForm(true)}
            className="btn-add"
          >
            Add
          </button>
        </div>
        
        <div className='note-container'>
          {filteredNotes.map(note =>
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
              <hr className="note-divider" />
              <div className="note-content">
                {note.content && note.content.trim() !== "" 
                  ? note.content 
                  : "Content goes here..."}
              </div>
            </button>
          )}
        </div>
        
        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default NotesTab
