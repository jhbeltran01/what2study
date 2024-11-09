import axios from 'axios'
import React, { useState } from 'react'
import { apiRootURL } from '@root/globals'

function Main() {
  const initialSize = 10
  const [name, setName] = useState('')
  const [size, setSize] = useState(initialSize)
  const [accessCode, setAccessCode] = useState()

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

  const joinStudypod = () => {
    event.preventDefault()
    
    axios
      .post(
        `${apiRootURL}/studypods/join/`,
        {access_code: accessCode}
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
    <div className='container-1'>
      <h2>Create Pod</h2>

      <form onSubmit={createStudyPod}>
        <div>
          <label htmlFor="name">Group Name</label>
          <input 
            value={name}
            type="text" 
            id="name" 
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className='flex'>
          <div>
            <label htmlFor="size">Group Size</label>
            <input 
              value={size}
              type="number" 
              id="size" 
              onChange={e => setSize(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="class">Class</label>
            <input type="text" id="class" />
          </div>
        </div>

        <div className='text-right'>
          <button type="submit">Create</button>
        </div>
      </form>

      <hr />

      <div>
        <h3>Join Pod</h3>
        <form onSubmit={joinStudypod}>
          <label htmlFor="code">Pod Code</label>
          <input 
            value={accessCode}
            type="text"
            id="code" 
            onChange={(e) => setAccessCode(e.target.value)}
          />
          <button type="submit">Join</button>
        </form>
      </div>
    </div>
  )
}

export default Main
