import React, { useState } from 'react'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Studypod() {
  const initialSize = 10
  const [name, setName] = useState('')
  const [size, setSize] = useState(initialSize)
  const [accessCode, setAccessCode] = useState('')
  const [className, setClassName] = useState('') 
  const [error, setError] = useState('') 
  const [successMessage, setSuccessMessage] = useState('')

  const createStudyPod = (event) => {
    event.preventDefault()
    if (!name || !size || size <= 0) {
      setError('Please provide valid group name and size.')
      return
    }

    setError('') 

    axios
      .post(
        `${apiRootURL}/studypods/`,
        {
          name: name,
          size: size,
        }
      )
      .then(response => {
        console.log('success')
        setName('')
        setSize(initialSize)
        setSuccessMessage('Pod created successfully!')
      })
      .catch(err => {
        console.log(err)
        setError('Failed to create pod. Please try again later.')
      })
  }

  const joinStudypod = (event) => {
    event.preventDefault()
    if (!accessCode) {
      setError('Please provide a pod code.')
      return
    }

    setError('') 

    axios
      .post(
        `${apiRootURL}/studypods/join/`,
        { access_code: accessCode }
      )
      .then(response => {
        setAccessCode('')
        setSuccessMessage('Successfully joined the pod!')
      })
      .catch(err => {
        console.log(err)
        setError('Failed to join pod. Please check the pod code and try again.')
      })
  }

  return (
    <div className='studypod-container'>
      <div className='studypod-wrapper'>
        <h2 className='studypod-title'>Create Pod</h2>
        {error && <p className="error-message">{error}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={createStudyPod} className="studypod-form">
          <div className='studypod-form-group'>
            <label htmlFor="name">Group Name</label>
            <input 
              value={name}
              type="text" 
              id="name" 
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className='studypod-form-row'>
            <div className='studypod-form-group'>
              <label htmlFor="size">Group Size</label>
              <input 
                value={size}
                type="number" 
                id="size" 
                onChange={e => setSize(e.target.value)}
              />
            </div>

            <div className='studypod-form-group'>
              <label htmlFor="class">Class</label>
              <input 
                value={className}
                type="text" 
                id="class" 
                onChange={e => setClassName(e.target.value)}
              />
            </div>
          </div>

          <div className='text-right'>
            <button type="submit" className="studypod-button">Create</button>
          </div>
        </form>

        <hr className="studypod-divider" />

        <div className="studypod-join-section">
          <h3 className="studypod-subtitle">Join Pod</h3>
          <form onSubmit={joinStudypod} className="studypod-form">
            <div className='studypod-form-group'>
              <label htmlFor="code">Pod Code</label>
              <input 
                value={accessCode}
                type="text"
                id="code" 
                onChange={(e) => setAccessCode(e.target.value)}
              />
            </div>
            <button type="submit" className="studypod-button">Join</button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Studypod
