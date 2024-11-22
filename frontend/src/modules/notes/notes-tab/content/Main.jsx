import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import { updateNote, setNote } from '@redux/note'
import { setNotes } from '@redux/notes'

function Main() {
  const note = useSelector(state => state.note.value)
  const notes = useSelector(state => state.notes.value)
  const dispatch = useDispatch()
  const [contentInputText, setContentInputText] = useState(note.content)

  const editContent = (event) => {
    const content = event.target.value

    axios
      .patch(
        `${apiRootURL}/notes/${note.slug}/`,
        {content: content}
      )
      .then(response => {
        dispatch(updateNote(response.data))
        updateNotes(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateNotes = (newNote) => {
    const tempNotes = notes.map(note => {
      if (note.slug != newNote.slug) { return note }
      return newNote
    })

    dispatch(setNotes(tempNotes))
  }
  
  const getNote = (event) => {
    const selectedNoteSlug = event.target.value
    const note = notes.filter(note => note.slug == selectedNoteSlug)[0]

    dispatch(setNote(note))
    setContentInputText(note.content)
  }

  return (
    <div className="container-content">
      <div>
        <select 
          className="notes-dropdown" 
          defaultValue={note.slug} 
          onChange={getNote}
        >
          {notes.map(note => 
          <option value={note.slug} key={note.slug}>
          {note.name} 1
          </option>
          )}
        </select>

        <form>
          <textarea
            className="input-content"
            rows={10}
            onBlur={editContent}
            value={contentInputText}
            onChange={(e) => setContentInputText(e.target.value)}
          ></textarea>
        </form>
      </div>
    </div>
  )
}

export default Main
