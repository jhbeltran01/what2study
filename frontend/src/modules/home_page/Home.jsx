import searchIcon from '@assets/search.png';
import React, { useEffect, useState } from 'react';
import * as constants from './constants' ;
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import ReviewerCard from './ReviewerCard';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTabName, setActiveTabName] = useState(constants.PUBLIC_TAB)
  const [reviewers, setReviewers] = useState([]);
  const [isClicked, setIsClicked] = useState(false);


  useEffect(() => {
    axios
      .get(`${apiRootURL}/reviewers/public/?category=${activeTabName}`)
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

  const handleFocus = () => {
    setIsClicked(true);  // Set to true when the search input is focused
  };
  
  const handleBlur = () => {
    setIsClicked(false);  // Set to false when the search input loses focus
  };
  

  return (
    <div className="homepage-section p-4 flex flex-col">
      <div className="home-header mb-4 flex justify-between items-center">
        <div className="home-header-buttons">
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
        
        <form className="home-search-containerr" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="home-search-barr w-[100%]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
          />
          <button type="submit" className="home-search-buttonn">
            <img className="home-search-iconn" src={searchIcon} alt="Search" />
          </button>
        </form>
      </div>

      <section className='home-reviewer-content h-[100%] grid grid-responsive-1'>
        {reviewers.map((reviewer) => {
          return <ReviewerCard reviewer={reviewer} key={reviewer.slug}/>
        })}
      </section>
    </div>
  );
};

export default Home;