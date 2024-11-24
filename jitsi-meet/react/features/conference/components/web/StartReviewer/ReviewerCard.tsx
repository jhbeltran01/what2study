import React, { useContext } from 'react'
import { SocketContext } from './Main'
import { actions } from './constants'

interface Reviewer {
  [key: string]: any; // Keys are strings, and values are strings.
}

interface MyComponentProps {
  reviewer: Reviewer;
}


const ReviewerCard:  React.FC<MyComponentProps> = ({reviewer}) => {
  const socket = useContext(SocketContext)

  const startReviewing = () => {
    const message = JSON.stringify({
      action: actions.SELECT_REVIEWER,
      reviewer_slug: reviewer.slug
    })
    socket?.send(message)
  }

  return (
    <div className="reviewer-entry">
      <div className="reviewer-header">
        <h2 className="reviewer-title black">{reviewer.name}</h2>
        <div className="reviewer-info">
          <span className="reviewer-date black">2024-09-15</span>
        </div>
        <button className="more-options">⋮</button>
      </div>
      <p className="reviewer-created-by black">Created by: {reviewer.reviewer_info.owner.username}</p>
      <button 
        className="view-link black"
        onClick={startReviewing}
      >
        View
      </button>
    </div>
  )
}

export default ReviewerCard
