import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { apiRootURL } from '@root/globals'

function Form({subjectsState, showFormState}) {
  const [subjects, setSubjects] = subjectsState
  const setShowForm = showFormState[1]
  const [name, setName] = useState('')

  const createSubject = (event) => {
    event.preventDefault()

    axios
      .post(
        `${apiRootURL}/subjects/`,
        {name: name}
      )
      .then(response => {
        setSubjects([response.data, ...subjects])
        setName('')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='overlay-1 flex justify-center items-center text-white'>
      <form
        onSubmit={createSubject}
        className='form-1'
      >
        <div>
          <button onClick={() => setShowForm(false)} type="button">Close</button>
        </div>
        
        <div>
          <label htmlFor="name">Class</label>
          <input 
            value={name}
            className='text-black' 
            type="text" 
            id="name" 
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  )
}

Form.propTypes = {
  subjectsState: PropTypes.array.isRequired,
  showFormState: PropTypes.array.isRequired
}

export default Form
