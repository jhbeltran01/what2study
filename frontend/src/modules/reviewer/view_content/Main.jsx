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
    // Add reviewer to recently viewed
    axios
      .post(
        `${apiRootURL}/reviewers/public/recently-viewed/add/`
        + `?reviewer=${reviewer.slug}&is_public=${reviewer.is_public}`
      )
      .then((response) => {
        console.log(response.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewer]);

  useEffect(() => {
    axios
      .get(
        `${apiRootURL}/reviewers/public/${reviewer.slug}/`
        + `?is_get_content=True&is_partial=True&is_public=${reviewer.is_public}`
      )
      .then((response) => {
        console.log(response.data)
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
        {
          titles.length > 0
          ? (
              <ul>
                {titles.map((title) => (
                  <Title title={title} key={title.slug} />
                ))}
              </ul>
            )
          : <h1 className='text-center'>No available content.</h1>
        }
      </div>
    </div>
  );
}

export default Main;
