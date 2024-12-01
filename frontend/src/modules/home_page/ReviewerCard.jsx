import React, { useState } from 'react'
import personIcon from '@assets/person.png'
import bookmark from '@assets/bookmark.svg'
import PropTypes from 'prop-types';
import axios from 'axios';
import { apiRootURL } from '../../globals';
import { useNavigate } from 'react-router-dom';
import { setReviewer, setReviewerIsPublic } from '@redux/reviewer';
import * as routes from '../../routes/constants';
import { useDispatch } from 'react-redux';

function ReviewerCard({reviewer}) {
  const owner = reviewer.owner;
  const [isBookmarked, setIsBookmarked] = useState(reviewer.is_bookmarked)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const updatedBookmarkStatus = (is_bookmarked) => {
    axios
      .post(
        `${apiRootURL}/reviewers/public/bookmark/`
        + `?reviewer=${reviewer.slug}&is_bookmarked=${is_bookmarked}`
      )
      .then(response => {
        response
        setIsBookmarked(is_bookmarked)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const redirectToSelectedReviewerContent = () => {
    dispatch(setReviewer(reviewer))
    dispatch(setReviewerIsPublic(true))
      // Ensure that the public status is passed correctly
    const isPublic = reviewer.is_public || false; // Use reviewer’s actual public status
    navigate(routes.VIEW_CONTENT_WITHOUT_EDIT);
  }

  return (
    <div className="home-reviewer-entry">
        <div className="home-bookmark  flex justify-between items-center">
          <h2 className="home-reviewer-title">{reviewer.name}</h2> 
          <button className='bookmark-button' onClick={() => updatedBookmarkStatus(!isBookmarked)}>
            <img 
              className={`bookmark-icon ${isBookmarked && 'bookmarked'}`}
              src={bookmark} 
              alt="bookmark icon" 
            />
          </button>
        </div>
        <p className='home-reviewer-description'>{reviewer.desc_1 ? reviewer.desc_1 : 'No description' }</p>
        {/* <div className='home-icon flex gap-[10px]'>
          <img 
            className='icon-3'
            src={owner.profile_picture ? owner.profile_picture : personIcon} 
            alt="person icon" 
          />
          <p className='home-reviewer-owner'>{owner.first_name} {owner.last_name}</p>
        </div> */}

        <p className="home-reviewer-date">{reviewer.created_at}</p>

        <button 
          onClick={redirectToSelectedReviewerContent} 
          className='home-view-link'
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
        first_name: PropTypes.string.isRequired,
        last_name: PropTypes.string.isRequired,
        profile_picture: PropTypes.string
    }).isRequired,
    description: PropTypes.string.isRequired,
    created_at: PropTypes.string.isRequired,
    is_bookmarked: PropTypes.bool.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
};


export default ReviewerCard