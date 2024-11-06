import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiRootURL } from '@root/globals'
import { useSelector } from 'react-redux'

function Options() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [isPublic, setIsPublic] = useState(reviewer.is_public)

  const updatePublicStatusOfReviewer = (event) => {
    const willSetToPublic = event.target.checked

    if (willSetToPublic) {
      publicizeReviewer()
      return
    }

    changeToPrivate()
  }

  const publicizeReviewer = () => {
    axios
    .post(
      `${apiRootURL}/reviewers/public/`,
      {reviewer: reviewer.slug}
    )
    .then(response => {
      console.log(response.status)
      setIsPublic(true)
    })
    .catch(err => {
      console.log(err.request.response)
    })
  }

  const changeToPrivate = () => {
    axios
    .delete(
      `${apiRootURL}/reviewers/public/${reviewer.slug}/`,
    )
    .then(response => {
      console.log(response.status)
      setIsPublic(false)
    })
    .catch(err => {
      console.log(err.request.response)
    })
  }

  return (
    <div className='dropdown-1 relative'>
      <button className='btn-options'>⋮</button>

      <div className='dropdown-1__content hidden'>
        <ul>
          <li>
            <div className='flex gap-[10px]'>
              <input
                checked={isPublic}
                id='is-public' 
                type="checkbox" 
                onChange={updatePublicStatusOfReviewer}
              />
              <label htmlFor="is-public">Public</label>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Options
