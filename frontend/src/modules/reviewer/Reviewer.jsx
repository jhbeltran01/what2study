import searchIcon from '@assets/search.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Ensure this is imported correctly
import '../../sass/pages/_reviewer.scss';

const Reviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

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

      {/* Reviewer content section */}
      <div className="reviewer-content">
        {/* Example reviewer entry */}
        <div className="reviewer-entry">
          <div className="reviewer-header">
            <h2 className="reviewer-title">Reviewer Title</h2>
            <div className="reviewer-info">
              <span className="reviewer-type">Enumeration</span>
              <span className="reviewer-date">2024-09-15</span>
            </div>
            <button className="more-options">⋮</button>
          </div>
          <p className="reviewer-created-by">Created by: User Name</p>
          <a href="#" className="view-link">View</a>
        </div>

        {/* Divider */}
        <hr className="divider" />

        {/* Add more reviewer entries here */}
      </div>
    </section>
  );
};

export default Reviewer;
