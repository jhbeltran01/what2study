import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import ReviewerCard from '@modules/reviewer/ReviewerCard'
import { CREATE_REVIEWER } from '@root/routes/constants'
import { Link } from 'react-router-dom'
import { SUBJECT_CREATE_REVIEWER } from '@root/routes/constants'

function Main() {
  const subject = useSelector(state => state.subject.value)
  const [reviewers, setReviewers] = useState([])

  useEffect(() => {
    axios
      .get(`${apiRootURL}/subjects/${subject.slug}/reviewers/`)
      .then(response => {
        setReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div className='container-1'>
      <header className='flex justify-between'>
        <p>My Reviewers</p>
        <input type="text" placeholder="Search" />
      </header>


      <div className='mt-[2rem]'>
        <div className='text-right'>
          <Link to={SUBJECT_CREATE_REVIEWER}>Add</Link>
        </div>

        <div className='grid grid-responsive-1'>
          {reviewers.map(reviewer => <ReviewerCard  reviewer={reviewer} key={reviewer.slug} />)}
        </div>
      </div>
    </div>
  )
}

export default Main
