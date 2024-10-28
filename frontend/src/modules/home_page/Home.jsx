import searchIcon from '@assets/search.png';
import React, { useEffect, useState } from 'react';
import * as constants from './constants' ;
import axios from 'axios';
import { apiRootURl } from '@root/globals';
import ReviewerCard from './ReviewerCard';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabName, setActiveTabName] = useState(constants.PUBLIC_TAB)
  const [reviewers, setReviewers] = useState([])

  useEffect(() => {
    axios
      .get(`${apiRootURl}/reviewers/public/`)
      .then(response => {
        setReviewers(response.data.results)
      })
      .catch(err => {
        console.log(err)
      })
  }, [activeTabName])

  const handleClick = (section) => {
    setActiveTabName(section);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle the search logic here
    console.log('Search term:', searchTerm);
  };

  return (
    <div className="homepage-section p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div className="header-buttons">
          <button
            onClick={() => handleClick(constants.PUBLIC_TAB)}
            className={activeTabName === constants.PUBLIC_TAB ? 'active' : ''}
          >
            Public Reviewers
          </button>
          <button
            onClick={() => handleClick(constants.RECENTLY_VIEWED_TAB)}
            className={activeTabName === constants.RECENTLY_VIEWED_TAB ? 'active' : ''}
          >
            Recently Viewed
          </button>
          <button
            onClick={() => handleClick(constants.BOOKMARK_TAB)}
            className={activeTabName === constants.BOOKMARK_TAB ? 'active' : ''}
          >
            Bookmarks
          </button>
        </div>
        
        <form className="block relative" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar w-[100%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="pos-item-1">
            <img className="icon-2" src={searchIcon} alt="Search" />
          </button>
        </form>
      </div>

      <section className='reviewer-content h-[100%] grid grid-responsive'>
        {reviewers.map((reviewer) => {
          return <ReviewerCard reviewer={reviewer} key={reviewer.slug}/>
        })}
      </section>
    </div>
  );
};

export default Home;