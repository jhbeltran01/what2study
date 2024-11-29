import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setReviewer, setReviewerSlug } from '@redux/reviewer';
import * as routes from '@root/routes/constants';
import { useNavigate } from 'react-router-dom';
import { apiRootURL } from '@root/globals';
import axios from 'axios';
function ReviewerCard({ reviewer, contentRoute = routes.VIEW_REVIEWER_CONTENT }) {
  const [showOptions, setShowOptions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleOptions = () => setShowOptions((prev) => !prev);

  const handleEdit = () => {
    // setShowOptions(false); // Close the menu
    // navigate(routes.EDIT_REVIEWER.replace(':slug', reviewer.slug));
    // navigate('/edit-reviewers');
    navigate('/reviewers/edit-reviewer');

  };

  const handleDelete = async () => {
    const confirmed = window.confirm(`Are you sure you want to delete ${reviewer.name}?`);
    if (confirmed) {
        try {
            const response = await axios.delete(`${apiRootURL}/reviewers/${reviewer.slug}/`);
            if (response) {
                alert("Reviewer successfully deleted.");
                location.reload()
            } else {
                alert("Failed to delete the reviewer.");
            }
        } catch (error) {
            console.error("Error deleting reviewer:", error);
            alert("An error occurred while trying to delete the reviewer.");
        }
      setShowOptions(false);
    }
};


  const redirectToSelectedReviewerContent = () => {
    dispatch(setReviewer(reviewer));
    dispatch(setReviewerSlug(reviewer.slug));
    navigate(contentRoute);
  };

  return (
    <div className="reviewer-entry">
      <div className="reviewer-header">
        <h2 className="reviewer-title">{reviewer.name}</h2>
        <div className="more-options-container">
          <button
            className="more-options"
            onClick={toggleOptions}
            aria-expanded={showOptions}
            aria-haspopup="true"
          >
            ⋮
          </button>
          {showOptions && (
            <div className="options-menu">
              <button onClick={handleEdit} className="options-item">
                Edit
              </button>
              <button onClick={handleDelete} className="options-item">
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="reviewer-date-owner">
        <p className="reviewer-created-by">Created by: {reviewer.owner.username}</p>
        <span className="reviewer-date">2024-09-15</span>
      </div>
      <button onClick={redirectToSelectedReviewerContent} className="view-link">
        View
      </button>
    </div>
  );
}

ReviewerCard.propTypes = {
  reviewer: PropTypes.shape({
    name: PropTypes.string.isRequired,
    owner: PropTypes.shape({
      username: PropTypes.string.isRequired,
    }).isRequired,
    profile_picture: PropTypes.string,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  contentRoute: PropTypes.string,
};

export default ReviewerCard;
