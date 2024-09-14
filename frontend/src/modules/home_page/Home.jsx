import searchIcon from '@assets/search.png';
import React, { useState } from 'react';
import '../../sass/pages/_homepage.scss';


const Home = () => {
  const [active, setActive] = useState('public-reviewers');
  const [searchTerm, setSearchTerm] = useState('');

  const handleClick = (section) => {
    setActive(section);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Handle the search logic here
    console.log('Search term:', searchTerm);
  };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4 flex justify-between items-center">
        <div className="header-buttons">
          <button
            onClick={() => handleClick('public-reviewers')}
            className={active === 'public-reviewers' ? 'active' : ''}
          >
            Public Reviewers
          </button>
          <button
            onClick={() => handleClick('recently-viewed')}
            className={active === 'recently-viewed' ? 'active' : ''}
          >
            Recently Viewed
          </button>
          <button
            onClick={() => handleClick('bookmarks')}
            className={active === 'bookmarks' ? 'active' : ''}
          >
            Bookmarks
          </button>
        </div>
        
        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="search-button">
            <img src={searchIcon} alt="Search" className="search-icon" />
          </button>
        </form>

        <div className="content">


        </div>
      </div>
    </section>
  );
};

export default Home;