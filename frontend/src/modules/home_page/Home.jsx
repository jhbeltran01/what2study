import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import searchIcon from '@assets/search.png';
import bookmarksIcon from '@assets/bookmark.png'; // Default unbookmarked icon
import bookmarkedIcon from '@assets/bookmarked.png'; // Default bookmarked icon
import '../../sass/pages/_homepage.scss';

const Home = () => {
  const [active, setActive] = useState('public-reviewers');
  const [searchTerm, setSearchTerm] = useState('');
  const [publicReviewers, setPublicReviewers] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(storedBookmarks);
  }, []);

  useEffect(() => {
    if (active === 'public-reviewers') {
      const storedPublicReviewers = JSON.parse(localStorage.getItem('publicReviewers')) || [];
      setPublicReviewers(storedPublicReviewers);
    } else if (active === 'recently-viewed') {
      const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      setRecentlyViewed(storedRecentlyViewed);
    }
  }, [active]);

  const handleClick = (section) => {
    setActive(section);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const handleBookmarkClick = (reviewer) => {
    const isBookmarked = bookmarks.some((b) => b.id === reviewer.id);
    let updatedBookmarks;

    if (isBookmarked) {
      updatedBookmarks = bookmarks.filter((b) => b.id !== reviewer.id);
    } else {
      updatedBookmarks = [...bookmarks, reviewer];
    }

    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    console.log(`Toggled bookmark for ${reviewer.name}. Current bookmarks:`, updatedBookmarks);
  };

  const isBookmarked = (reviewerId) => bookmarks.some((b) => b.id === reviewerId);

  const renderBookmarkIcon = (reviewerId) => {
    if (active === 'bookmarks') {
      return isBookmarked(reviewerId) ? bookmarkedIcon : bookmarksIcon;
    }
    return bookmarksIcon; // Always use the unbookmarked icon in public reviewers
  };

  const renderContent = (data) => (
    <div className="reviewer-content">
      <ul>
        {data.length > 0 ? (
          data.map((item) => (
            <li key={item.id} className="reviewer-entry">
              <div className="reviewer-header">
                <h3 className="reviewer-title">{item.name}</h3>
                <div className="reviewer-info">
                  <p className="reviewer-type">{item.type}</p>
                  <p className="reviewer-created-by">Created By: {item.createdBy}</p>
                  <p className="reviewer-date">Date: {item.date}</p>
                </div>
              </div>
              <button 
                className="bookmark-button"
                onClick={() => handleBookmarkClick(item)}
              >
                <img 
                  src={renderBookmarkIcon(item.id)} 
                  alt="Bookmark" 
                  className="bookmarks-icon" 
                />
              </button>
              <Link to={`/view/${item.id}`} className="view-link">
                View Details
              </Link>
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
