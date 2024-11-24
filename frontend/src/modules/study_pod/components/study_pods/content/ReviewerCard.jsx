import PropTypes from 'prop-types'
import React from 'react'

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
      <p className="reviewer-created-by">Created by: {reviewer.reviewer_info.owner.username}</p>
    </div>
  )
}

ReviewerCard.propTypes = {
  reviewer: PropTypes.object.isRequired
}

export default ReviewerCard
