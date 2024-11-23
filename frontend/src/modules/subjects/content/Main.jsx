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

  const reviewersTabContent = () => (
    <div className='mt-[2rem]' key={1}>
      <div className='text-right'>
        <Link to={SUBJECT_CREATE_REVIEWER} className="btn-add">Add</Link>
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

  const notesTabContent = () => (
    <div className='mt-[2rem]' key={2}>
      <div className='text-right'>
        <button onClick={() => setShowForm(true)} className="btn-add">Add</button>
      </div>

      <div className='grid grid-responsive-1'>
        {notes
          .filter(note => note.name.toLowerCase().includes(searchQuery.toLowerCase())) 
          .map(note => (
            <button onClick={() => redirectToNoteContent(note)} key={note.slug}>
              {note.name}
            </button>
          ))}
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
          <button onClick={() => setActiveTab(index)} key={index} className="btn-4">
            {tab}
          </button>
        ))}
      </div>

      {tabs[activeTab]}
    </div>
  )
}

export default Main
