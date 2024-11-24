import searchIcon from '@assets/search.png';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported correctly
import { apiRootURL } from '@root/globals';
import axios from 'axios';
import ReviewerCard from './ReviewerCard';

const Reviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewers, setReviewers] = useState([])
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const reviewersUrl = `${apiRootURL}/reviewers/`

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
          Hello
        </button>
      </div>

      <div className="reviewer-content h-[100%] grid grid-responsive-1">
        {reviewers.map((reviewer) => {
          return <ReviewerCard reviewer={reviewer} key={reviewer.slug} />
        })}
      </div>
    </section>
  );
};

export default Reviewer;
