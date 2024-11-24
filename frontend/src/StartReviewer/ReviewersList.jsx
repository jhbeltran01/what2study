import React from 'react'
import ReviewerCard from './ReviewerCard'

function ReviewersList({reviewers}) {
  return (
    <div className='grid grid-responsive-1 gap-[10px]'>
      {reviewers.map(reviewer => <ReviewerCard reviewer={reviewer} key={reviewer.slug} />)}
    </div>
  )
}

export default ReviewersList
