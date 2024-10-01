/* Nicole B. Castillo
  [STUD-006] Homepage
  Handles Public Reviewer and Bookmark features. */

import React, { useEffect, useState } from 'react'; // Import necessary React components and hooks
import { Link } from 'react-router-dom'; // Import Link for navigation
import searchIcon from '@assets/search.png'; // Import the search icon
import bookmarksIcon from '@assets/bookmark.png'; // Import the unbookmarked icon
import bookmarkedIcon from '@assets/bookmarked.png'; // Import the bookmarked icon

const Home = () => {
  const [active, setActive] = useState('public-reviewers'); // State to track the active section
  const [searchTerm, setSearchTerm] = useState(''); // State to track the search term
  const [publicReviewers, setPublicReviewers] = useState([]); // State for public reviewers
  const [recentlyViewed, setRecentlyViewed] = useState([]); // State for recently viewed items
  const [bookmarks, setBookmarks] = useState([]); // State for bookmarks
  const [showNotification, setShowNotification] = useState(false); // State to control notification visibility
  const [notificationMessage, setNotificationMessage] = useState(''); // State for notification message

  // Effect to load bookmarks from local storage
  useEffect(() => {
    const storedBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    setBookmarks(storedBookmarks);
  }, []);

  // Effect to load either public reviewers or recently viewed based on the active tab
  useEffect(() => {
    if (active === 'public-reviewers') {
      const storedPublicReviewers = JSON.parse(localStorage.getItem('publicReviewers')) || [];
      setPublicReviewers(storedPublicReviewers);
    } else if (active === 'recently-viewed') {
      const storedRecentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed')) || [];
      setRecentlyViewed(storedRecentlyViewed);
    }
  }, [active]); // Run effect when the active state changes

  // Function to handle clicking on tabs to switch sections
  const handleClick = (section) => {
    setActive(section);
  };

  // Function to handle search form submission
  const handleSearchSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log('Search term:', searchTerm); // Log the search term
  };

  // Function to handle bookmarking or unbookmarking a reviewer
  const handleBookmarkClick = (reviewer) => {
    const isBookmarked = bookmarks.some((b) => b.id === reviewer.id); // Check if the reviewer is already bookmarked
  
    // If in public reviewers, don't remove the bookmark, just show the notification
    if (active === 'public-reviewers') {
      if (isBookmarked) {
        setNotificationMessage(`${reviewer.name} is already in bookmarks`); // Notify that the reviewer is already bookmarked
      } else {
        const updatedBookmarks = [...bookmarks, reviewer]; // Add reviewer to bookmarks
        setBookmarks(updatedBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks)); // Save updated bookmarks to local storage
        setNotificationMessage(`Successfully added ${reviewer.name} to bookmarks`); // Notify success
      }
    } else if (active === 'bookmarks') {
      // If in bookmarks section, allow removing from bookmarks
      if (isBookmarked) {
        const updatedBookmarks = bookmarks.filter((b) => b.id !== reviewer.id); // Remove reviewer from bookmarks
        setBookmarks(updatedBookmarks);
        localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks)); // Update local storage
        setNotificationMessage(`Removed ${reviewer.name} from bookmarks`); // Notify removal
      }
    }
  
    // Show notification
    setShowNotification(true);
  
    // Hide notification after 3 seconds
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Function to check if a reviewer is bookmarked
  const isBookmarked = (reviewerId) => bookmarks.some((b) => b.id === reviewerId);

  // Function to render the appropriate bookmark icon based on the active section
  const renderBookmarkIcon = (reviewerId) => {
    if (active === 'bookmarks') {
      return isBookmarked(reviewerId) ? bookmarkedIcon : bookmarksIcon; // Show appropriate icon in bookmarks
    }
    return bookmarksIcon; // Always use the unbookmarked icon in public reviewers
  };

  // Function to render content for each section
  const renderContent = (data) => (
    <div className="reviewer-content">
      <ul>
        {data.length > 0 ? ( // Check if there's data to display
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
                onClick={() => handleBookmarkClick(item)} // Handle bookmarking logic
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
          <p>No items found.</p> // Message when no items are available
        )}
      </ul>
    </div>
  );

  return (
    <section className="homepage-section p-4 flex flex-col">
      {/* Notification Popup */}
      {showNotification && (
        <div className="notification-popup">
          {notificationMessage} {/* Display notification message */}
        </div>
      )}
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
        
        {/* Search bar */}
        <form className="home-search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search..."
            className="home-search-bar"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Update search term on change
          />
          <button type="submit" className="home-search-button">
            <img src={searchIcon} alt="Search" className="home-search-icon" />
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

export default Home; // Export the Home component
