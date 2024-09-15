import searchIcon from '@assets/search.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../../sass/pages/_createreviewer.scss';

const CreateReviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewerType, setReviewerType] = useState('Enumeration'); // Default type
  const [numQuestions, setNumQuestions] = useState(10); // Number of questions toggle
  const [description, setDescription] = useState('');
  const [showTypeDropdown, setShowTypeDropdown] = useState(false); // Dropdown visibility state
  const navigate = useNavigate(); // Initialize useNavigate

  // Question types
  const questionTypes = ['Enumeration', 'Multiple Choice', 'True or False', 'Matching Type'];

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


  const handleFileUpload = (event) => {
    console.log('File uploaded:', event.target.files[0]); // Logic for handling file upload
  };

  const handleTypeClick = () => {
    setShowTypeDropdown(!showTypeDropdown); // Toggle the visibility of the dropdown
  };

  const handleTypeSelection = (type) => {
    setReviewerType(type); // Set the selected type
    setShowTypeDropdown(false); // Hide the dropdown after selection
  };

  return (
    <section className="create-section p-4 flex flex-col">
      <div className="header mb-4">
        <button className="header-title" onClick={handleTitleClick}>
          {'← Back to Reviewers'}
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
      <form className="reviewer-form">
  <div className="form-group reviewer-name-group">
    <label htmlFor="reviewerName">Reviewer Name:</label>
    <input
      type="text"
      id="reviewerName"
      placeholder="Enter reviewer name"
      className="input-field"
    />
  </div>

  <div className="form-group num-questions-group">
    <label htmlFor="numQuestions">No. of Questions:</label>
    <div className="input-toggle-wrapper">
      <input
        type="number"
        id="numQuestions"
        value={numQuestions}
        onChange={(e) => setNumQuestions(e.target.value)}
        className="input-field"
      />

    </div>
  </div>

          <div className="form-group">
            <label>Type of Question:</label>
            <div className="dropdown-wrapper">
              <button type="button" className="dropdown-toggle-button" onClick={handleTypeClick}>
                {reviewerType} &#x25BC; {/* Down arrow symbol */}
              </button>
              {showTypeDropdown && (
                <ul className="dropdown-list">
                  {questionTypes.map((type) => (
                    <li
                      key={type}
                      className="dropdown-item"
                      onClick={() => handleTypeSelection(type)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Upload Content:</label>
            <div className="upload-field">
              <input type="file" id="uploadFile" className="input-field" onChange={handleFileUpload} />
              <label htmlFor="uploadFile" className="upload-link">
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              placeholder="Enter description"
              className="input-field"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button type="submit" className="submit-button">Create</button>
        </form>
      </div>
    </section>
  );
};

export default CreateReviewer;
