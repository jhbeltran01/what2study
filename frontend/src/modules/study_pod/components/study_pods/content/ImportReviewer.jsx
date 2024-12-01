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

  const importReviewer = (reviewerPassed) => {
    axios
      .post(
        `${apiRootURL}/studypods/${studypod.slug}/reviewers/`,
        {
          studypod: studypod.slug,
          reviewer: reviewerPassed.slug,
          name: reviewerPassed.name,
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
      <div className='max-w-[800px] w-[100%] max-h-[500px] overflow-scroll form-2 relative'>
        <div>
          <div className='text-right'>
            <button 
              onClick={() => setWillImportReviewer(false)}
              className='btn-close-1 mb-[1rem]'
            >
              CLOSE
            </button>
          </div>
          {reviewers.map(innerReviewer => (
            <div key={innerReviewer.slug}>
              <div className='flex justify-between items-center import-reviewer'>
                <p>{innerReviewer.name}</p>
                <button
                  onClick={() => importReviewer(innerReviewer)}
                  className='import-btn'
                >
                  Import
                </button>
              </div>
            </div>
          ))}
          {
            reviewers.length > 10
            && <div className='text-right'>
                <button 
                  onClick={() => setWillImportReviewer(false)}
                  className='btn-close-1 mb-[1rem]'
                >
                  CLOSE
                </button>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

ImportReviewer.propTypes = {
  studypodReviewersState: PropTypes.array.isRequired,
  setWillImportReviewer: PropTypes.func.isRequired,
}

export default ImportReviewer
