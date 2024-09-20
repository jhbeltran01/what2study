import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import searchIcon from '@assets/search.png';
import '../../sass/pages/_reviewer.scss';

const Reviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewers, setReviewers] = useState([]);
  const [dropdownIndex, setDropdownIndex] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedReviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    setReviewers(storedReviewers);
  }, []);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  const handleTitleClick = () => {
    navigate('/reviewers');
  };

  const handleViewClick = (index) => {
    const reviewer = reviewers[index];
    navigate('/reviewers/view-reviewer', { state: { reviewer } });
  };

  const handleMoreOptionsClick = (index) => {
    setDropdownIndex(dropdownIndex === index ? null : index);
  };

  const handleEditClick = (index) => {
    const reviewer = reviewers[index];
    navigate('/reviewers/edit-reviewer', { state: { reviewer } });
    setDropdownIndex(null);
  };

  const handleDeleteClick = (index) => {
    const confirmation = window.confirm("Are you sure you want to delete the reviewer?");
    if (confirmation) {
      const reviewerToDelete = reviewers[index];
      
      // Delete from main reviewers
      const updatedReviewers = reviewers.filter((_, i) => i !== index);
      setReviewers(updatedReviewers);
      localStorage.setItem('reviewers', JSON.stringify(updatedReviewers));

      // Remove from bookmarks
      const existingBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
      const updatedBookmarks = existingBookmarks.filter(bookmark => bookmark.name !== reviewerToDelete.name);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));

      setDropdownIndex(null);
    }
  };

  const handleBookmarkClick = (index) => {
    const reviewer = reviewers[index];
    const existingBookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
    const updatedBookmarks = [...existingBookmarks, reviewer];
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    alert(`${reviewer.name} has been added to bookmarks.`);
  };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="header mb-4">
        <button className="header-title" onClick={handleTitleClick}>
          My Reviewers
        </button>

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

        <button className="create-button" onClick={handleCreateClick}>
          Create
        </button>
      </div>

      <div className="reviewer-content">
        {reviewers.map((reviewer, index) => (
          <div key={index} className="reviewer-entry">
            <div className="reviewer-header">
              <h2 className="reviewer-title">{reviewer.name}</h2>
              <div className="reviewer-info">
                <span className="reviewer-type">{reviewer.type}</span>
                <span className="reviewer-date">{reviewer.date}</span>
              </div>
              <p className="reviewer-description">Description: {reviewer.description}</p>
              <button className="more-options" onClick={() => handleMoreOptionsClick(index)}>
                ⋮
              </button>
              {dropdownIndex === index && (
                <div className="dropdown-menu">
                  <button onClick={() => handleEditClick(index)}>Edit</button>
                  <button onClick={() => handleDeleteClick(index)}>Delete</button>
                  <button onClick={() => handleBookmarkClick(index)}>Add Bookmark</button>
                </div>
              )}
            </div>
            <p className="reviewer-created-by">Created by: {reviewer.createdBy}</p>
            <button className="view-link" onClick={() => handleViewClick(index)}>
              View
            </button>
            <hr className="divider" />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviewer;
