import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import searchIcon from '@assets/search.png';

const initialReviewer = {
  name: '',
  description: '',
  files: []
};

const EditReviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewer, setReviewer] = useState(initialReviewer);
  const [successMessage, setSuccessMessage] = useState(''); // For success message
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    console.log('Search term:', searchTerm);
  };

  const handleCreateClick = () => {
    navigate('/reviewers/create-reviewer');
  };

  const handleTitleClick = () => {
    navigate('/reviewers'); // Redirect to Reviewer page
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

    const formData = new FormData();
    formData.append('name', reviewer.name);
    formData.append('description', reviewer.description);

    Array.from(reviewer.files).forEach((file, index) => {
      formData.append('files', file);
    });

    try {
      // Corrected URL with template literals
      await axios.post(`${apiRootURL}/reviewers/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }
      });
      
      setReviewer(initialReviewer); // Reset form
      setSuccessMessage('Reviewer created successfully!'); // Set success message

      // Clear the success message after a few seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 5000);
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  return (
    <section className="create-section p-4 flex flex-col">
      <div className="create-reviewer-header flex items-center justify-between mb-4">
      <button className='back-create-button' onClick={handleTitleClick}>Back</button>
      </div>

      <div className="create-reviewer-content">
        {successMessage && (
          <div className="success-message">
            {successMessage}
          </div>
        )}
        <form className="reviewer-form" onSubmit={handleSubmit}>
          <div className="form-group reviewer-name-group">
            <label htmlFor="reviewerName">Reviewer Name:</label>
            <input
              type="text"
              id="reviewerName"
              placeholder="Enter reviewer name"
              className="input-field"
              name='name'
              value={reviewer.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Upload Content:</label>
            <div className="upload-field">
              <input 
                type="file" 
                id="uploadFile" 
                className="input-field"
                onChange={handleFileUpload} 
                multiple="multiple"
              />
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
              value={reviewer.description}
              name='description'
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="submit-button">Update</button>
        </form>
      </div>
    </section>
  );
};

export default EditReviewer;
