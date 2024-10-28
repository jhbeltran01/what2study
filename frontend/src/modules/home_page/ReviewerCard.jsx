import React from 'react'
import personIcon from '@assets/person.png'
import bookmark from '@assets/bookmark.svg'
import PropTypes from 'prop-types';

function ReviewerCard({reviewer}) {
  const owner = reviewer.owner;

  return (
    <div className="reviewer-entry">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="reviewer-title">{reviewer.name}</h2>
          
          <button>
            <img src={bookmark} alt="bookmark icon" />
          </button>
        </div>

        <p className="reviewer-date">{reviewer.created_at}</p>

        <div className='flex gap-[10px]'>
          <img 
            className='icon-3'
            src={owner.profile_picture ? owner.profile_picture : personIcon} 
            alt="person icon" 
          />

          <p>{owner.first_name} {owner.last_name}</p>
        </div>

        <p>{reviewer.description ? reviewer.description : 'No description' }</p>
    
        {/* <p className="reviewer-created-by">Created by: {reviewer.owner.username}</p> */}
        <a href="#" className="view-link">View</a>
      </div>
    </div>
  )
}


ReviewerCard.propTypes = {
  reviewer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
        username: PropTypes.string.isRequired,
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        profile_picture: PropTypes.string
    }).isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
  }).isRequired,
};


export default ReviewerCard
