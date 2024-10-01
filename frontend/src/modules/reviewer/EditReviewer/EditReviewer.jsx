//import '../../../sass/pages/_createreviewer.scss';
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EditReviewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { reviewer } = location.state;

  // State variables
  const [reviewerName, setReviewerName] = useState(reviewer.name);
  const [reviewerType, setReviewerType] = useState(reviewer.type);
  const [numQuestions, setNumQuestions] = useState(reviewer.numQuestions);
  const [description, setDescription] = useState(reviewer.description);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [visibility, setVisibility] = useState(reviewer.visibility);
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const [notification, setNotification] = useState('');

  // Constants for dropdowns
  const questionTypes = ['Enumeration', 'Multiple Choice', 'True or False', 'Matching Type'];
  const visibilityOptions = ['Private', 'Public'];

  // Handlers
  const handleUpdateClick = () => {
    const updatedReviewer = {
      ...reviewer,
      name: reviewerName,
      type: reviewerType,
      numQuestions,
      description,
      file: uploadedFile ? uploadedFile.name : reviewer.file,
      visibility,
    };

    const reviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    const updatedReviewers = reviewers.map((r) => (r.name === reviewer.name ? updatedReviewer : r));

    localStorage.setItem('reviewers', JSON.stringify(updatedReviewers));
    
    // Set notification message
    setNotification('Reviewer updated successfully!');
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification('');
    }, 3000);

    navigate('/reviewers');
  };

  const handleTitleClick = () => navigate('/reviewers');
  const handleFileUpload = (event) => setUploadedFile(event.target.files[0]);

  const toggleDropdown = (type) => {
    if (type === 'type') setShowTypeDropdown(!showTypeDropdown);
    else if (type === 'visibility') setShowVisibilityDropdown(!showVisibilityDropdown);
  };

  const handleSelection = (type, selection) => {
    if (type === 'reviewerType') {
      setReviewerType(selection);
      setShowTypeDropdown(false);
    } else if (type === 'visibility') {
      setVisibility(selection);
      setShowVisibilityDropdown(false);
    }
  };

  return (
    <section className="create-section">
      <div className="create">
        <div className="header">
          <button className="header-title" onClick={handleTitleClick}>
            {'← Back to Reviewers'}
          </button>
        </div>

        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}

        <div className="reviewer-content">
          <form className="reviewer-form">
            <div className="form-group">
              <label htmlFor="reviewerName">Reviewer Name:</label>
              <input
                type="text"
                id="reviewerName"
                placeholder="Enter reviewer name"
                className="input-field"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
              />
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

            <div className="form-group">
              <label htmlFor="numQuestions">No. of Questions:</label>
              <input
                type="number"
                id="numQuestions"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                className="input-field"
              />
            </div>

            <div className="form-group dropdown-wrapper">
              <label>Type of Question:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('type')}
              >
                {reviewerType}
                <span className="dropdown-icon">&#x25BC;</span>
              </button>
              {showTypeDropdown && (
                <ul className="dropdown-list">
                  {questionTypes.map((type) => (
                    <li
                      key={type}
                      className="dropdown-item"
                      onClick={() => handleSelection('reviewerType', type)}
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group dropdown-wrapper">
              <label>Visibility:</label>
              <button
                type="button"
                className="dropdown-toggle-button"
                onClick={() => toggleDropdown('visibility')}
              >
                {visibility}
                <span className="dropdown-icon">&#x25BC;</span>
              </button>
              {showVisibilityDropdown && (
                <ul className="dropdown-list">
                  {visibilityOptions.map((option) => (
                    <li
                      key={option}
                      className="dropdown-item"
                      onClick={() => handleSelection('visibility', option)}
                    >
                      {option}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="uploadFile">Upload Content:</label>
              <input
                type="file"
                id="uploadFile"
                className="input-field"
                onChange={handleFileUpload}
              />
            </div>

            <button type="button" className="update-button" onClick={handleUpdateClick}>
              Update
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default EditReviewer;
