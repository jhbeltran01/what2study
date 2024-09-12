import React, { useState } from 'react';
import blueIcon from '@assets/blue.png';
import floralIcon from '@assets/floral.png';
import pinkIcon from '@assets/pink.png';
import searchIcon from '@assets/search.png';
import skyIcon from '@assets/sky.png';

const Home = () => {
  const [active, setActive] = useState('public-reviewers');

  const handleClick = (section) => {
    setActive(section);
  };

  const images = [floralIcon, pinkIcon, blueIcon, skyIcon];

  return (
    <section className="h-screen p-4 flex flex-col">
      <div className="header mb-4">
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
        <div className="search-container">
          <input
            type="text"
            placeholder="Search..."
            className="search-bar"
          />
          <img src={searchIcon} alt="Search" className="search-icon" />
        </div>
      </div>
      <div className={`underline ${active}`} />

      <div className="content-container">
        {Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="content-box"
          >
            <div className="icon">
              <img src={images[index % images.length]} alt="Icon" />
            </div>
            <div className="content-text">
              <p>Subject {index + 1}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Home;
