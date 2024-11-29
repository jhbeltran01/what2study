import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Correctly import useNavigate
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import Title from './Title';

function Main() {
  const reviewer = useSelector((state) => state.reviewer.value);
  const [titles, setTitles] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTitleClick = () => {
    navigate('/'); // Redirect to Reviewer page
  };

  useEffect(() => {
    console.log(reviewer)
    if (!reviewer.is_public) return;

    // Add reviewer to recently viewed
    axios
      .post(
        `${apiRootURL}/reviewers/public/recently-viewed/add/?reviewer=${reviewer.slug}`
      )
      .then((response) => {
        console.log(response.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewer]);

  useEffect(() => {
    // Get the content of the reviewer
    axios
      .get(
        `${apiRootURL}/reviewers/public/${reviewer.reviewer}/?is_get_content=True&is_partial=True`
      )
      .then((response) => {
        setTitles(response.data.titles);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewer]);

  return (
    <div className="content-preview">
    <button className="back-reviewer-button" onClick={handleTitleClick}>
    Back
  </button>
    <div className="reviewer-main-container">

      {/* Render Titles */}
      <ul>
        {titles.map((title) => (
          <Title title={title} key={title.slug} />
        ))}
      </ul>
    </div>
    </div>
  );
}

export default Main;
