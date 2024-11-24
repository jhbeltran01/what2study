import React, { useState } from 'react'
import axios from 'axios'
import { apiRootURL } from '@root/globals'

function Studypod() {
  const initialSize = 10
  const [name, setName] = useState('')
  const [size, setSize] = useState(initialSize)
  const [accessCode, setAccessCode] = useState('')

  const createStudyPod = (event) => {
    event.preventDefault()

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
      })
      .catch(err => {
        console.log(err)
      })
  }

  const joinStudypod = (event) => {
    event.preventDefault()
    
    axios
      .post(
        `${apiRootURL}/studypods/join/`,
        { access_code: accessCode }
      )
      .then(response => {
        setAccessCode('')
        console.log('success')
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='studypod-container'>
      <div className='studypod-wrapper'>
      <h2 className='studypod-title'>Create Pod</h2>

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
            <input type="text" id="class" />
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
