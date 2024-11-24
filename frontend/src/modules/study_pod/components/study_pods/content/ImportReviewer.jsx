import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { apiRootURL } from '@root/globals'
import { useSelector } from 'react-redux'
import PropTypes from 'prop-types'

function ImportReviewer({studypodReviewersState, setWillImportReviewer}) {
  const reviewer = useSelector(state => state.reviewer.value)
  const studypod = useSelector(state => state.studypod.value)
  const [reviewers, setReviewers] = useState([])
  const [studypodReviewers, setStudypodReviewers] = studypodReviewersState

  useEffect(() => {
    axios
      .get(`${apiRootURL}/reviewers/`)
      .then(response => {
        setReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const importReviewer = (reviewerSlug) => {
    axios
      .post(
        `${apiRootURL}/studypods/${studypod.slug}/reviewers/`,
        {
          studypod: studypod.slug,
          reviewer: reviewer.slug,
          name: reviewer.name,
        }
      )
      .then(response => {
        setStudypodReviewers([response.data, ...studypodReviewers])
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='overlay-1 flex justify-center items-center'>
      <div className='max-w-[400px] w-[100%] form-2'>
        {reviewers.map(reviewer => (
          <div key={reviewer.slug}>
            <div className='text-right'>
              <button onClick={() => setWillImportReviewer(false)}>Close</button>
            </div>

            <div className='flex justify-between'>
              <p>{reviewer.name}</p>
              <button
                onClick={() => importReviewer(reviewer.slug)}
              >
                Import
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

ImportReviewer.propTypes = {
  studypodReviewersState: PropTypes.array.isRequired,
  setWillImportReviewer: PropTypes.func.isRequired,
}

export default ImportReviewer
