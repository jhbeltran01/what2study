import React, { useEffect, useState } from 'react'
import ImportReviewer from './ImportReviewer'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import { useSelector } from 'react-redux'
import ReviewerCard from './ReviewerCard'

function Main() {
  const studypod = useSelector(state => state.studypod.value)
  const [willImportReviewer, setWillImportReviewer] = useState(false)
  const [studypodReviewers, setStudypodReviewers] = useState([])

  useEffect(() => {
    axios
      .get(`${apiRootURL}/studypods/${studypod.slug}/reviewers/`)
      .then(response => {
        setStudypodReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [1])

  return (
    <div className='container-1'>
      <div>
        <button
          onClick={() => setWillImportReviewer(true)}
        >
          Import Reviewer
        </button>

        <div className='grid grid-responsive-1 mt-[2rem]'>
          {studypodReviewers.map(reviewer => (
            <ReviewerCard reviewer={reviewer} key={reviewer.slug} />
          ))}
        </div>
      </div>

      {
        willImportReviewer
        && <ImportReviewer 
            studypodReviewersState={[studypodReviewers, setStudypodReviewers]} 
            setWillImportReviewer={setWillImportReviewer}
           />
      }
    </div>
  )
}

export default Main
