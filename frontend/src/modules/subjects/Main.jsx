import React, { useEffect, useState } from 'react'
import Card from './Card'
import Form from './Form'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Main() {
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

        <div className='mt-2rem grid grid-responsive-1'>
          {subjects.map(subject => <Card subject={subject} key={subject.slug} />)}
        </div>
      </div>

      {
        showForm
        && <Form
          subjectsState={[subjects, setSubjects]}
          showFormState={[showForm, setShowForm]}
        />}
    </div>
  )
}

export default Main
