import React from 'react'
import ReviewerCard from './ReviewerCard'

interface MyComponentProps {
  reviewers: any[];
}

const ReviewersList: React.FC<MyComponentProps> = ({reviewers}) => {
  return (
    <div className='grid grid-responsive-1 gap-[10px]'>
      {reviewers.map(reviewer => <ReviewerCard reviewer={reviewer} key={reviewer.slug} />)}
    </div>
  )
}

export default ReviewersList
