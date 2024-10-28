import React from 'react'
import PropTypes from 'prop-types';

function ReviewerCard({reviewer}) {
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
      <a href="#" className="view-link">View</a>
    </div>
  )
}

ReviewerCard.propTypes = {
  reviewer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
        username: PropTypes.string.isRequired,
    }).isRequired,
    profile_picture: PropTypes.string
  }).isRequired,
};


export default ReviewerCard
