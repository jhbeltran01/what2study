import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';

function ImportReviewer({ studypodReviewersState }) {
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

  const handleReviewerClick = (reviewer) => {
    const confirmImport = window.confirm(`Do you want to import ${reviewer.name}?`);
    if (confirmImport) {
      axios
        .post(`${apiRootURL}/studypods/${studypod.slug}/reviewers/`, {
          studypod: studypod.slug,
          reviewer: reviewer.slug,
          name: reviewer.name,
        })
        .then((response) => {
          setStudypodReviewers((prev) => [...prev, response.data]);
          console.log(`${reviewer.name} imported successfully!`);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  return (
    <div className="reviewer-list-toggle">
      <ul className="reviewer-list">
        {reviewers.map((reviewer) => (
          <li
            key={reviewer.slug}
            className="reviewer-item"
            onClick={() => handleReviewerClick(reviewer)}
          >
            {reviewer.name}
          </li>
        ))}
      </ul>
    </div>
  );
}


export default ImportReviewer;
