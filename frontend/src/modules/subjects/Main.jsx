import React, { useEffect, useState } from 'react'
import Card from './Card'
import Form from './Form'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Main() {
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDeleteMode, setIsDeleteMode] = useState(false)

  useEffect(() => {
    axios
      .get(`${apiRootURL}/subjects`)
      .then(response => {
        setSubjects(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleDelete = async (subjectSlug) => {
    const confirmed = window.confirm("Are you sure you want to delete this subject?")
    if (confirmed) {
      try {
        await axios.delete(`${apiRootURL}/subjects/${subjectSlug}/`)
        alert('Subject deleted successfully.')
        const response = await axios.get(`${apiRootURL}/subjects`)
        setSubjects(response.data.results)
      } catch (error) {
        console.error('Error deleting subject:', error)
        alert('An error occurred while trying to delete the subject.')
      }
    }
  }

  return (
    <div className='container-1'>
      <div>
        <header className='flex justify-between'>
          <h2 className='btn-4'>Subjects</h2>
          
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
        </header>

        <div className="flex gap-2">
          {!isDeleteMode && (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="btn-delete"
            >
              Delete
            </button>
          )}

          {isDeleteMode && (
            <button
              onClick={() => setIsDeleteMode(false)}
              className="btn-cancel"
            >
              Cancel
            </button>
          )}
        </div>

        <div className='mt-2rem grid grid-responsive-1'>
          {subjects.length === 0 && !isDeleteMode ? (
            <p className="no-subjects-message">
              You don't have any subjects yet.
            </p>
          ) : (
            subjects.filter(subject =>
              subject.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).map(subject => (
              <div key={subject.slug} className="subject-card">
                <Card 
                  subject={subject} 
                  isDeleteMode={isDeleteMode} 
                  handleDelete={handleDelete} 
                />
              </div>
            ))
          )}
        </div>
      </div>

      {showForm && (
        <Form
          subjectsState={[subjects, setSubjects]}
          showFormState={[showForm, setShowForm]}
          setMessage={(msg) => console.log(msg)}  
          closeMessageAfterTimeout={() => setTimeout(() => {}, 3000)}  
        />
      )}
    </div>
  )
}

export default Main