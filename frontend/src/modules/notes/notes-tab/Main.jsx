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
  const [searchQuery, setSearchQuery] = useState('')
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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredNotes = notes.filter(note =>
    note.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const renderRows = () => {
    const rows = []
    let noteIndex = 0
    while (noteIndex < filteredNotes.length) {
      const currentRow = []
      const rowCount = rows.length % 2 === 0 ? 5 : 4

      for (let j = 0; j < rowCount && noteIndex < filteredNotes.length; j++, noteIndex++) {
        const note = filteredNotes[noteIndex]
        currentRow.push(
          <button
            key={noteIndex} 
            className="note-card"
            onClick={() => redirectToNoteContent(note)} 
          >
            <h3>{note.name}</h3>  {/* Display title */}
          </button>
        )
      }

      rows.push(
        <div key={rows.length} className="notes-row">
          {currentRow}
        </div>
      )
    }
    return rows
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
            className="search-bar2"
          />
          <button
            onClick={() => setShowForm(true)}
            className="btn-add"
          >
            Add
          </button>
        </div>

        <div className="notes-list">
          {filteredNotes.length > 0 ? renderRows() : <p>No notes available</p>}
        </div>

        {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
