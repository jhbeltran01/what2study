import searchIcon from '@assets/search.png';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRootURL } from '@root/globals';
import axios from 'axios';
import ReviewerCard from './ReviewerCard';

const Reviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewers, setReviewers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const reviewersUrl = `${apiRootURL}/reviewers/`;

    axios
      .get(reviewersUrl)
      .then((response) => {
        setReviewers(response.data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="rev-header flex items-center justify-between mb-4">
        <h1 className="rev-header-title">My Reviewers</h1>
        <div className="actions flex items-center gap-4">
        <form className="search-containerr" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-barr w-[100%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-buttonn">
            <img className="search-iconn" src={searchIcon} alt="Search" />
          </button>
        </form>
          <button className="create-rev-button" onClick={handleCreateClick}>
            Create
          </button>
        </div>
    </div>
      <div className="reviewer-content h-[100%] grid grid-responsive-1">
        {reviewers.map((reviewer) => {
          return <ReviewerCard reviewer={reviewer} key={reviewer.slug} />;
        })}
      </div>
    </section>
  );
};

export default Reviewer;
