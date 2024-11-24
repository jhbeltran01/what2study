import axios from 'axios';
import React, { useState } from 'react';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';

function Options() {
  const reviewer = useSelector((state) => state.reviewer.value);
  const [isPublic, setIsPublic] = useState(reviewer.is_public);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false); // State to toggle visibility

  const toggleOptionsVisibility = () => {
    setIsOptionsVisible((prev) => !prev); // Toggle the visibility
  };

  const updatePublicStatusOfReviewer = (event) => {
    const willSetToPublic = event.target.checked;

    if (willSetToPublic) {
      publicizeReviewer();
      return;
    }

    changeToPrivate();
  };

  // const publicizeReviewer = () => {
  //   axios
  //     .post(`${apiRootURL}/reviewers/public/`, { reviewer: reviewer.slug })
  //     .then((response) => {
  //       console.log(response.status);
  //       setIsPublic(true);
  //     })
  //     .catch((err) => {
  //       console.log(err.request.response);
  //     });
  // };

  const publicizeReviewer = () => {
    axios
      .post(`${apiRootURL}/reviewers/public/`, { reviewer: reviewer.slug })
      .then((response) => {
        console.log(response.status);
        setIsPublic(true);
        // Dispatch action to update Redux store
        dispatch(setReviewerIsPublic(true)); // Update public status in Redux
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  };
  

  // const changeToPrivate = () => {
  //   axios
  //     .delete(`${apiRootURL}/reviewers/public/${reviewer.slug}/`)
  //     .then((response) => {
  //       console.log(response.status);
  //       setIsPublic(false);
  //     })
  //     .catch((err) => {
  //       console.log(err.request.response);
  //     });
  // };

  const changeToPrivate = () => {
    axios
      .delete(`${apiRootURL}/reviewers/public/${reviewer.slug}/`)
      .then((response) => {
        console.log(response.status);
        setIsPublic(false);
        // Dispatch action to update Redux store
        dispatch(setReviewerIsPublic(false)); // Update public status in Redux
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  };

  return (
    <div className="options-container">
      <button className="option-button" onClick={toggleOptionsVisibility}>
        ⋮
      </button>

      {isOptionsVisible && ( // Conditionally render public-checkbox
        <div className={`public-content ${isOptionsVisible ? 'visible' : ''}`}>
        <ul>
            <div className="public-checkbox">
              <input
                checked={isPublic}
                id="is-public"
                type="checkbox"
                onChange={updatePublicStatusOfReviewer}
              />
              <label htmlFor="is-public">Public</label>
            </div>
          </ul>
        </div>
      )}
    </div>
  );
}

export default Options;
