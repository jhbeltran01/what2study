import React, { useContext } from 'react';
import { SocketContext } from './Main';
import { actions } from './constants';

interface Reviewer {
  reviewer: string;
  name: string;
  created_at?: string;
  reviewer_info: {
    owner: {
      username: string;
    };
  };
}

interface ReviewerCardProps {
  reviewer: Reviewer;
}

const ReviewerCard: React.FC<ReviewerCardProps> = ({ reviewer }) => {
  const socket = useContext(SocketContext);

  const startReviewing = () => {
    if (socket?.readyState === WebSocket.OPEN) {
      const message = JSON.stringify({
        action: actions.SELECT_REVIEWER,
        reviewer_slug: reviewer.reviewer,
      });
      socket.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  };

  return (
    <div className="reviewer-entry">
      <div className="reviewer-header">
        <h2 className="reviewer-title">{reviewer.name}</h2>
        <div className="reviewer-info">
          <span className="reviewer-date">
            {reviewer.created_at ? new Date(reviewer.created_at).toLocaleDateString() : 'Unknown Date'}
          </span>
        </div>
        <button className="more-options" aria-label="More options">⋮</button>
      </div>
      <p className="reviewer-created-by">
        Created by: {reviewer?.reviewer_info?.owner?.username || 'Unknown'}
      </p>
      <button 
        className="view-link"
        onClick={startReviewing}
      >
        View
      </button>
    </div>
  );
};

export default ReviewerCard;