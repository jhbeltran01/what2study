import React, { useEffect, useState } from 'react';
import ImportReviewer from './ImportReviewer';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';
import ReviewerCard from './ReviewerCard';

function Main() {
  const studypod = useSelector((state) => state.studypod.value);
  const [willImportReviewer, setWillImportReviewer] = useState(false);
  const [studypodReviewers, setStudypodReviewers] = useState([]);

  useEffect(() => {
    axios
      .get(`${apiRootURL}/studypods/${studypod.slug}/reviewers/`)
      .then((response) => {
        setStudypodReviewers(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [studypod.slug]);

  const toggleImportReviewer = () => {
    setWillImportReviewer(!willImportReviewer);
  };

  return (
    <div className='container-2'>
      <div>
        <button
          className="import-reviewer-button"
          onClick={toggleImportReviewer}
        >
          {willImportReviewer ? 'Hide Reviewer List' : 'Import Reviewer'}
        </button>
      </div>

      {willImportReviewer && (
        <ImportReviewer
          studypodReviewersState={[studypodReviewers, setStudypodReviewers]}
        />
      )}

      <div className="grid grid grid-responsive-1 mt-[2rem]">
        {studypodReviewers.map((reviewer) => (
          <ReviewerCard reviewer={reviewer} key={reviewer.slug} />
        ))}
      </div>
    </div>
  );
}


export default Main;
