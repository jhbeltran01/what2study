import React, { useEffect, useState } from 'react'
import Card from './Card'
import Form from './Form'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Main() {
  const [subjects, setSubjects] = useState([])
  const [showForm, setShowForm] = useState(false)

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

  return (
    <div className='container-1'>
      <div>
        <header className='flex justify-between'>
          <h2>Subjects</h2>
          <div>
            <button onClick={() => setShowForm(true)}>Add</button>
            <input type="text" placeholder='Search' />
          </div>
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
