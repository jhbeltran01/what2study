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
    <div className='settings-container'>
      <h2 className='settings-title'>Account Settings</h2>

      <div className='settings-grid settings-grid-2-column-1'>
        <form className='settings-form' onSubmit={updateAccount}>
          <div className='settings-form-group'>
            <label className='settings-label' htmlFor="username">Username</label>
            <input 
              className='settings-input'
              value={username}
              type="text" 
              id="username" 
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          
          <div className='settings-form-group'>
            <label className='settings-label' htmlFor="password">Password</label>
            <input 
              className='settings-input'
              value={password}
              type="password" 
              id="password" 
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='settings-button-group'>
            <button className='settings-button settings-cancel-button' onClick={clearForm} type='button'>Cancel</button>
            <button className='settings-button settings-save-button' type='submit'>Save</button>
          </div>
        </form>

        <div className='settings-info'>
          <h6 className='settings-info-title'>Password Requirements</h6>

          <ul className='settings-info-list'>
            <li className='settings-info-item'>At least 8 characters</li>
            <li className='settings-info-item'>At least one uppercase letter</li>
            <li className='settings-info-item'>At least one number</li>
            <li className='settings-info-item'>At least one special character</li>
          </ul>

          <div className='settings-delete-button-container'>
            <button className='settings-button settings-delete-button' onClick={deleteAccount}>Delete</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main