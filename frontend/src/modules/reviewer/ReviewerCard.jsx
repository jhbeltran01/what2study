import React from 'react'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setReviewer, setReviewerSlug } from '@redux/reviewer';
import * as routes from '@root/routes/constants';
import { useNavigate } from 'react-router-dom';

function ReviewerCard({reviewer, contentRoute=routes.VIEW_REVIEWER_CONTENT}) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const redirectToSelectedReviewerContent = () => {
    dispatch(setReviewer(reviewer))
    dispatch(setReviewerSlug(reviewer.slug))
    navigate(contentRoute)
  }

  return (
    <div className="reviewer-entry">
      <div className="reviewer-header">
        <h2 className="reviewer-title">{reviewer.name}</h2>
        <div className="reviewer-info">
          <span className="reviewer-date">2024-09-15</span>
        </div>
        <button className="more-options">⋮</button>
      </div>
      <p className="reviewer-created-by">Created by: {reviewer.owner.username}</p>
      <button 
        onClick={redirectToSelectedReviewerContent} 
        className="view-link"
      >
        View
      </button>
    </div>
  )
}

ReviewerCard.propTypes = {
  reviewer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
    profile_picture: PropTypes.string,
    slug: PropTypes.string.isRequired
  }).isRequired,
  contentRoute: PropTypes.string
};


export default ReviewerCard
