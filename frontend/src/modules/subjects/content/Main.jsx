import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import ReviewerCard from '@modules/reviewer/ReviewerCard'
import { Link, useNavigate } from 'react-router-dom'
import { SUBJECT_CREATE_REVIEWER } from '@root/routes/constants'
import { setNotes } from '@redux/notes'
import { setNote } from '@redux/note'
import CreateNoteForm from '../create_note/CreateNoteForm'
import { SUBJECT_NOTE, SUBJECT_REVIEWER } from '@root/routes/constants'

function Main() {
  const subject = useSelector(state => state.subject.value)
  const notes = useSelector(state => state.notes.value)
  const [reviewers, setReviewers] = useState([])
  const [activeTab, setActiveTab] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteMode, setIsDeleteMode] = useState(false)  
  const tabNames = ['Reviewers', 'Notes']
  const [showForm, setShowForm] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    switch (activeTab) {
      case 0:
        getReviewers()
        break
      case 1:
        getNotes()
        break
    }
  }, [activeTab])

  const getReviewers = () => {
    axios
      .get(`${apiRootURL}/subjects/${subject.slug}/reviewers/`)
      .then(response => {
        setReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const getNotes = () => {
    dispatch(setNotes([]))
    axios
      .get(`${apiRootURL}/subjects/${subject.slug}/notes/`)
      .then(response => {
        dispatch(setNotes(response.data.results))
      })
      .catch(err => {
        console.log(err)
      })
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const handleDelete = async (noteId) => {  
    const confirmed = window.confirm("Are you sure you want to delete this note?");
    if (confirmed) {
      try {
        await axios.delete(`${apiRootURL}/notes/${noteId}/`);
        alert('Note deleted successfully.');
        const response = await axios.get(`${apiRootURL}/subjects/${subject.slug}/notes/`);
        dispatch(setNotes(response.data.results));
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('An error occurred while trying to delete the note.');
      }
    }
  };

  const reviewersTabContent = () => (
    <div className='mt-[2rem]' key={1}>
      <div className='text-right'>
        {(!isDeleteMode && (
          <Link to={SUBJECT_CREATE_REVIEWER} className="btn-add">Add</Link>
        )) || (
          <button onClick={() => setIsDeleteMode(false)} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>

      <div className='grid grid-responsive-1'>
        {reviewers
          .filter(reviewer => reviewer.name.toLowerCase().includes(searchQuery.toLowerCase())) 
          .map(reviewer => (
            <ReviewerCard contentRoute={SUBJECT_REVIEWER} reviewer={reviewer} key={reviewer.slug} />
          ))}
      </div>
    </div>
  )

  const renderRows = () => {
    const rows = [];
    let noteIndex = 0;
    
    const filteredNotes = notes
      .filter(note => note.name.toLowerCase()
      .includes(searchQuery.toLowerCase())) 

    while (noteIndex < filteredNotes.length) {
      const currentRow = [];
      const rowCount = rows.length % 2 === 0 ? 5 : 4;
  
      for (let j = 0; j < rowCount && noteIndex < filteredNotes.length; j++, noteIndex++) {
        const note = filteredNotes[noteIndex];
        currentRow.push(
          <div 
            key={noteIndex} 
            className={`note-card-container ${isDeleteMode ? 'wiggle' : ''}`} 
          >
            <div className="note-card">
              <button
                className="note-card-button"
                onClick={() => redirectToNoteContent(note)} 
              >
                <h3>{note.name}</h3>
              </button>
              {isDeleteMode && (
                <button 
                  onClick={() => handleDelete(note.slug)}  
                  className="delete-note-icon"
                >
                  🗑️ 
                </button>
              )}
            </div>
          </div>
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

  const notesTabContent = () => (
    <div className='mt-[2rem]' key={2}>
      <div className='text-right'>
        {(!isDeleteMode && (
          <button onClick={() => setShowForm(true)} className="btn-add">Add</button>
        )) || (
          <button onClick={() => setIsDeleteMode(false)} className="btn-cancel">
            Cancel
          </button>
        )}
      </div>

      <div className='notes-list'>
      {notes.length > 0 ? renderRows() : <p className='text-center'>Hey there! Looks like you don't have any notes yet. Start adding some!</p>}
      </div>

      {showForm && <CreateNoteForm setShowForm={setShowForm} />}
    </div>
  )

  const redirectToNoteContent = (note) => {
    dispatch(setNote(note))
    navigate(SUBJECT_NOTE)
  }

  const tabs = [reviewersTabContent(), notesTabContent()]

  return (
    <div className='container-1'>
      <header className='flex justify-between'>
        <p className='subject-name'>{subject.name}</p>
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search..."
          className="search-bar2"
        />
      </header>

      <div>
        {tabNames.map((tab, index) => (
          <button onClick={() => setActiveTab(index)} key={index} className={`btn-4 ${activeTab == index && 'active'}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-2">
        {!isDeleteMode ? (
          <>
            <button
              onClick={() => setIsDeleteMode(true)}
              className="btn-delete"
            >
              Delete
            </button>
            <button
              onClick={() => setShowForm(true)}
              className="btn-add"
            >
              Add
            </button>
          </>
        ) : null}
      </div>

      {tabs[activeTab]}
    </div>
  )
}

export default Main 