import React, { useEffect, useState } from 'react';
import searchIcon from '@assets/search.png';
import '../../sass/pages/_homepage.scss';

const Home = () => {
  const [active, setActive] = useState('public-reviewers');
  const [searchTerm, setSearchTerm] = useState('');
  const [publicReviewers, setPublicReviewers] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    // Fetch data based on active tab
    if (active === 'public-reviewers') {
      const storedPublicReviewers = JSON.parse(localStorage.getItem('publicReviewers')) || [];
      setPublicReviewers(storedPublicReviewers);
    } else if (active === 'recently-viewed') {
      const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      setRecentlyViewed(storedRecentlyViewed);
    } else if (active === 'bookmarks') {
      const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
      setBookmarks(storedBookmarks);
    }
  }, [active]);

  const handleClick = (section) => {
    setActive(section);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const renderContent = (data) => (
    <div className="reviewer-content">
      <ul>
        {data.length > 0 ? (
          data.map((item, index) => (
            <li key={index} className="reviewer-entry">
              <div className="reviewer-header">
                <h3 className="reviewer-title">{item.name}</h3>
                <div className="reviewer-info">
                  <p className="reviewer-type">{item.type}</p>
                  <p className="reviewer-created-by">Created By: {item.createdBy}</p>
                  <p className="reviewer-date">Date: {item.date}</p>
                </div>
              </div>
              <button className="more-options">...</button>
              <a href={`/view/${item.id}`} className="view-link">View Details</a>
            </li>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </ul>
    </div>
  );

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4 flex justify-between items-center">
        <div className="header-buttons">
          <button onClick={() => handleClick('public-reviewers')} className={active === 'public-reviewers' ? 'active' : ''}>
            Public Reviewers
          </button>
          <button onClick={() => handleClick('recently-viewed')} className={active === 'recently-viewed' ? 'active' : ''}>
            Recently Viewed
          </button>
          <button onClick={() => handleClick('bookmarks')} className={active === 'bookmarks' ? 'active' : ''}>
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
      </div>

      {/* Render content based on active tab */}
      {active === 'public-reviewers' && renderContent(publicReviewers)}
      {active === 'recently-viewed' && renderContent(recentlyViewed)}
      {active === 'bookmarks' && renderContent(bookmarks)}
    </section>
  );
};

export default Home;
