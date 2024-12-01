import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';

function ImportReviewer({ studypodReviewersState, setWillImportReviewer }) {
  const [studypodReviewers, setStudypodReviewers] = studypodReviewersState;
  const [reviewers, setReviewers] = useState([]);
  const studypod = useSelector((state) => state.studypod.value);

  useEffect(() => {
    axios
      .get(`${apiRootURL}/reviewers/`)
      .then((response) => {
        setReviewers(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const importReviewer = (reviewerPassed) => {
    axios
      .post(
        `${apiRootURL}/studypods/${studypod.slug}/reviewers/`,
        {
          studypod: studypod.slug,
          reviewer: reviewerPassed.slug,
          name: reviewerPassed.name,
        }
      )
      .then(response => {
        setStudypodReviewers([response.data, ...studypodReviewers])
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className='overlay'>
      <div className='form-container'>
        <div className='reviewer-list'>
          {reviewers.map(innerReviewer => (
            <div key={innerReviewer.slug} className='reviewer-item'>
              <p>{innerReviewer.name}</p>
              <button
                onClick={() => importReviewer(innerReviewer)}
                className='import-btn'
              >
                Import
              </button>
            </div>
          ))}
        </div>

        {reviewers.length > 10 && (
          <div className='close-button-container'>
            <button 
              onClick={() => setWillImportReviewer(false)}
              className='btn-close'
            >
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ImportReviewer;
