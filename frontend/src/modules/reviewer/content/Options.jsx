import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { apiRootURL } from "@root/globals";

function Options() {
  const reviewer = useSelector((state) => state.reviewer.value);
  const [isPublic, setIsPublic] = useState(reviewer.is_public);

  const updatePublicStatusOfReviewer = (event) => {
    const willSetToPublic = event.target.checked;

    if (willSetToPublic) {
      publicizeReviewer();
    } else {
      changeToPrivate();
    }
  };

  const publicizeReviewer = () => {
    axios
      .post(`${apiRootURL}/reviewers/public/`, { reviewer: reviewer.slug })
      .then((response) => {
        console.log(response.status);
        setIsPublic(true);
        // Dispatch action to update Redux store
        // dispatch(setReviewerIsPublic(true)); // Uncomment if using Redux
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  };

  const changeToPrivate = () => {
    axios
      .delete(`${apiRootURL}/reviewers/public/${reviewer.slug}/`)
      .then((response) => {
        console.log(response.status);
        setIsPublic(false);
        // Dispatch action to update Redux store
        // dispatch(setReviewerIsPublic(false)); // Uncomment if using Redux
      })
      .catch((err) => {
        console.log(err.request.response);
      });
  };

  return (
    <div className="options-container">
      <div className="public-checkbox">
        <input
          checked={isPublic}
          id="is-public"
          type="checkbox"
          onChange={updatePublicStatusOfReviewer}
        />
        <label htmlFor="is-public" className="public-label">Set Public</label>
      </div>
    </div>
  );
}

export default Options;
