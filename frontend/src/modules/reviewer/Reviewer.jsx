import searchIcon from '@assets/search.png';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported correctly
import '../../sass/pages/_reviewer.scss';
import { apiRootURl } from '../../globals';
import axios from 'axios';

const Reviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewers, setReviewers] = useState([])
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const reviewersUrl = `${apiRootURl}/reviewers/`

    axios
      .get(reviewersUrl)
      .then(response => {
        setReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
    // Handle the search logic here
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  const handleTitleClick = () => {
    navigate('/reviewers'); // Redirect to Reviewer page
  };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4">
        <button className="header-title" onClick={handleTitleClick}>
          My Reviewers
        </button>

        <form className="block relative mr-[1rem]" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="pos-item-1">
            <img className="icon-2" src={searchIcon} alt="Search" />
          </button>
        </form>

        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>

      <div className="reviewer-content h-[100%] grid grid-responsive">
        {reviewers.map((reviewer) => {
          return (
            <div className="reviewer-entry" key={reviewer.slug}>
              <div className="reviewer-header">
                <h2 className="reviewer-title">{reviewer.name}</h2>
                <div className="reviewer-info">
                  <span className="reviewer-date">2024-09-15</span>
                </div>
                <button className="more-options">⋮</button>
              </div>
              <p className="reviewer-created-by">Created by: {reviewer.owner.username}</p>
              <a href="#" className="view-link">View</a>
            </div>
          )
        })}
      </div>
    </section>
  );
};

export default Reviewer;
