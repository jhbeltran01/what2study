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

  const renderRows = () => {
    const rows = [];
    let noteIndex = 0;
    console.log(notes)
    while (noteIndex < notes.length) {
      const currentRow = [];
      const rowCount = rows.length % 2 === 0 ? 5 : 4;
  
      for (let j = 0; j < rowCount && noteIndex < notes.length; j++, noteIndex++) {
        const note = notes[noteIndex];
        currentRow.push(
          <b
            key={noteIndex} 
            className="note-card"
            onClick={() => redirectToNoteContent(note)} 
          >
            <h3>{note.name}</h3>  {/* Display title */}
          </b>
        );
      }
  
      rows.push(
        <div key={rows.length} className="notes-row">
          {currentRow}
        </div>
      );
    }
    return rows;
  };  

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
            <div className='notes-list'>
              {notes.length > 0 ? renderRows() : <p>No notes available</p>}
            </div>
          </div>
          {showForm && <Form />}
      </div>
    </ShowFormContext.Provider>
  )
}

export default Main
