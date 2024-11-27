import React, { useContext } from 'react'
import { SocketContext } from './Main'
import { actions } from './constants'

function ReviewerCard({reviewer}) {
  const socket = useContext(SocketContext)

  const startReviewing = () => {
    const message = JSON.stringify({
      action: actions.SELECT_REVIEWER,
      reviewer_slug: reviewer.slug
    })
    socket.send(message)
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
      <p className="reviewer-created-by">Created by: {reviewer.reviewer_info.owner.username}</p>
      <button 
        className="view-link"
        onClick={startReviewing}
      >
        View
      </button>
    </div>
  )
}

export default ReviewerCard
