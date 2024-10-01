//import '../../../sass/pages/_createreviewer.scss';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateReviewer = () => {
  const [reviewerName, setReviewerName] = useState('');
  const [reviewerType, setReviewerType] = useState('Enumeration');
  const [numQuestions, setNumQuestions] = useState(10);
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [visibility, setVisibility] = useState('Private');
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);
  const navigate = useNavigate();

  const questionTypes = ['Enumeration', 'Multiple Choice', 'True or False', 'Matching Type'];
  const visibilityOptions = ['Private', 'Public'];

  const handleCreateClick = () => {
    const reviewer = {
      name: reviewerName,
      type: reviewerType,
      numQuestions,
      date: new Date().toLocaleDateString(),
      description,
      createdBy: 'User Name',
      file: uploadedFile ? uploadedFile.name : 'No file uploaded',
      visibility
    };

    if (visibility === 'Public') {
      const publicReviewers = JSON.parse(localStorage.getItem('publicReviewers')) || [];
      publicReviewers.push(reviewer);
      localStorage.setItem('publicReviewers', JSON.stringify(publicReviewers));
    }

    const reviewers = JSON.parse(localStorage.getItem('reviewers')) || [];
    reviewers.push(reviewer);
    localStorage.setItem('reviewers', JSON.stringify(reviewers));

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
                <span className="dropdown-icon">&#x25BC;</span> {/* Dropdown arrow */}
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
                <span className="dropdown-icon">&#x25BC;</span> {/* Dropdown arrow */}
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

            <button type="button" className="submit-button" onClick={handleCreateClick}>
              Create
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CreateReviewer;
