import axios from 'axios'
import React, { useState } from 'react'
import { apiRootURL } from '@root/globals'
import { useDispatch, useSelector } from 'react-redux'
import { setUserInfo } from '@redux/user_info'

function Main() {
  const userInfo = useSelector(state => state.userInfo.value)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  const updateAccount = (event) => {
    event.preventDefault()

    const formData = {}

    if (username !== '' && username !== userInfo.username) { formData['username'] = username }
    if (password !== '') { formData['password'] = password }

    if (Object.keys(formData).length === 0) { 
      clearForm()
      return
    }

    axios
      .patch(
        `${apiRootURL}/settings/user-info/`,
        formData
      )
      .then(response => {
        if (password !== '') {
          location.reload()
          return
        }
        dispatch(setUserInfo(response.data))
        setUsername('')
      })
      .catch(err => {
        console.log(err)
      })
  }

  const clearForm = () => {
    setUsername('')
    setPassword('')
  }

  const deleteAccount = () => {
    axios
      .delete(
        `${apiRootURL}/settings/user-info/`
      )
      .then(response => {
        location.reload()
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='container-settings'>
      <p className='btn-44'>Account Settings</p>
      <div className='settings-container'>
        <div className='grid grid-2-column-1'>
          <form onSubmit={updateAccount}>
            <div>
              <label htmlFor="username">Username</label>
              <input 
                value={username}
                type="text" 
                id="username" 
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="password">Password</label>
              <input 
                value={password}
                type="password" 
                id="password" 
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <button 
                onClick={clearForm} 
                type='button' 
                name="cancelButton"
              >
                Cancel
              </button>
              <button 
                type='submit' 
                name="saveButton"
              >
                Save
              </button>
            </div>
          </form>

          <div>
            <h6>Password Requirements</h6>

            <ul>
              <li>At least 8 characters</li>
              <li>At least one uppercase letter</li>
              <li>At least one number</li>
              <li>At least one special character</li>
            </ul>

            <div>
              <button 
                onClick={deleteAccount} 
                name="deleteButton"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main