
import formatIcon from '@assets/format.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { apiRootURL } from '@root/globals';

const initialReviewer = {
  name: '',
  description: '',
  files: []
};

const CreateReviewer = () => {
  const [reviewer, setReviewer] = useState(initialReviewer);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const [isGuideVisible, setGuideVisible] = useState(false);
  const [isSampleVisible, setSampleVisible] = useState(false);

  const toggleSample = () => {
    setSampleVisible(!isSampleVisible);
  };

  const toggleGuide = () => {
    setGuideVisible(!isGuideVisible);
  };

  const handleTitleClick = () => {
    navigate('/reviewers');
  };

  const handleFileUpload = (event) => {
    setReviewer({
      ...reviewer,
      files: event.target.files
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReviewer({
      ...reviewer,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate inputs
    if (!reviewer.name.trim()) {
      setErrorMessage('Reviewer Name is required.');
      setSuccessMessage('');
      return;
    }
    if (!reviewer.description.trim()) {
      setErrorMessage('Reviewer Description is required.');
      setSuccessMessage('');
      return;
    }
    if (reviewer.files.length === 0) {
      setErrorMessage('Please upload at least one file.');
      setSuccessMessage('');
      return;
    }

    const formData = new FormData();
    formData.append('name', reviewer.name);
    formData.append('description', reviewer.description);

    Array.from(reviewer.files).forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${apiRootURL}/reviewers/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentage);
        },
      });

      if (response) {
        setReviewer(initialReviewer); // Clear form fields
        setSuccessMessage('Reviewer created successfully!');
        setErrorMessage('');
        setUploadProgress(0);
      }
    } catch (error) {
      setErrorMessage('Error creating reviewer. Please try again.');
      setSuccessMessage('');
      setUploadProgress(0);
    }
  };

  return (
    <section className="create-reviewer-section">
      <div className="create-reviewer-header">
        <button className="back-createrev-button" onClick={handleTitleClick}>
          Back
        </button>
        <button className="sample-button" onClick={toggleSample}>
          Sample
        </button>
        <button className="guide-button" onClick={toggleGuide}>
          Guide
        </button>

      </div>

      {isGuideVisible && (
        <div className="guide-popup">
          <div className="guide-content">
            <h2>Guide</h2>
            <div className="guide-text">
              <p>
                To create a document, kindly open your personal document editor such as Microsoft Word, WPS, Google Docs, and many more.
              </p>
              <p>
                To create a <strong>multiple choice</strong> type of reviewer in the document:
                <br />
                Begin with a hyphen sign <code>-</code> for questions. Hit enter. Begin with a plus sign <code>+</code> or dollar sign <code>$</code> for answers.
              </p>
              <p>
                To create an <strong>enumeration</strong> type of reviewer:
                <br />
                Begin with a greater-than sign <code>&gt;</code> for questions, and a plus sign <code>+</code> for answers.
              </p>
              <p>
                To create an <strong>identification</strong> type of reviewer:
                <br />
                Begin with a hyphen sign <code>-</code> for questions, followed by a plus sign <code>+</code> for answers.
              </p>
            </div>
            <button className="close-popup-button" onClick={toggleGuide}>
              Close
            </button>
          </div>
        </div>
              )}
              {/* </div> */}
            {/* ); */}

            {isSampleVisible && (
        <div className="sample-popup">
          <div className="sample-content">
            <h2>Sample Format</h2>
            <img className="search-image" src={formatIcon} alt="Search" />
            <button className="close-popup-button" onClick={toggleSample}>
              Close
            </button>
          </div>
        </div>
             )}


      <div className="create-reviewer-content">
        {/* Display success or error messages */}
        {successMessage && (
          <div className="rev-success-message">
            {successMessage}
            <button
              className="rev-close-message-button"
              onClick={() => setSuccessMessage('')}
            >
              &times;
            </button>
          </div>
        )}
        {errorMessage && (
          <div className="rev-error-message">
            {errorMessage}
            <button
              className="rev-close-message-button"
              onClick={() => setErrorMessage('')}
            >
              &times;
            </button>
          </div>
        )}

        <form className="create-reviewer-form" onSubmit={handleSubmit}>
          <div className="create-form-group">
            <label className="rev-label-name" htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter the reviewer's name"
              className="input-field"
              name="name"
              value={reviewer.name}
              onChange={handleChange}
            />
          </div>

          <div className="create-form-group">
            <label className="rev-label-upload" htmlFor="uploadFile">Upload PDF File:</label>
            <input
              type="file"
              id="uploadFile"
              className="input-field"
              accept="application/pdf" required
              onChange={handleFileUpload}
              multiple
            />
              {/* <span class="upload-error-message" style="color: red; display: none;">Please upload a valid PDF file.</span> */}

          </div>

          {uploadProgress > 0 && (
            <div className="progress-bar-container">
              <div
                className="progress-bar"
                style={{ width: `${uploadProgress}%` }}
              ></div>
              <span className="progress-percentage">{uploadProgress}%</span>
            </div>
          )}

          <div className="create-form-group">
            <label className="rev-label-description" htmlFor="description">Reviewer Description:</label>
            <input
              type="text"
              id="description"
              placeholder="Enter the reviewer's description"
              className="input-field"
              value={reviewer.description}
              name="description"
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">
            Create
          </button>
        </form>
      </div>
    </section>
  );
};

export default CreateReviewer;