import axios from 'axios'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import { updateNote, setNote } from '@redux/note'

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
        dispatch(updateNote({content: content}))
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  const getNote = (event) => {
    const selectedNoteSlug = event.target.value
    
    axios
      .get(`${apiRootURL}/notes/${selectedNoteSlug}/`)
      .then(response => {
        const data = response.data
        
        dispatch(setNote(data))
        setContentInputText(data.content)
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='container-1'>
      <div>
        <select 
          defaultValue={note.slug}
          onChange={getNote}
        >
          {notes.map(note => 
            <option 
              value={note.slug}
              key={note.slug}
            >
              {note.name}
            </option>
          )}
        </select>

        <form>
          <textarea
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
