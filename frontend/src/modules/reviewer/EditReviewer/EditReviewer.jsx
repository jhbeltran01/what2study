import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { apiRootURL } from '@root/globals';

const initialReviewer = {
  name: '',
  description: '',
  files: []
};

const EditReviewer = () => {
  const [reviewer, setReviewer] = useState(initialReviewer);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();  // Get the reviewer ID from the URL

  useEffect(() => {
    const fetchReviewerData = async () => {
      try {
        const response = await axios.get(`${apiRootURL}/reviewers/${id}`);
        if (response.data) {
          setReviewer(response.data); // Populate form with existing reviewer data
        }
      } catch (error) {
        console.error(error);
        setErrorMessage('Error fetching reviewer data.');
      }
    };

    fetchReviewerData();
  }, [id]);

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
      const response = await axios.put(`${apiRootURL}/reviewers/${id}`, formData, {
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
        setSuccessMessage('Reviewer updated successfully!');
        setErrorMessage('');
        setUploadProgress(0);
        setTimeout(() => navigate('/reviewers'), 2000); // Navigate to the reviewers list after 2 seconds
      }
    } catch (error) {
      setErrorMessage('Error updating reviewer. Please try again.');
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
      </div>
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
              accept="application/pdf"
              onChange={handleFileUpload}
              multiple
            />
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
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditReviewer;
