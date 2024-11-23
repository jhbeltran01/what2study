import searchIcon from '@assets/search.png';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import axios from 'axios';
import { apiRootURL } from '@root/globals';
// import axios from 'axios';

const initialReviewer = {
  name: '',
  description: '',
  files: []
}

const CreateReviewer = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewer, setReviewer] = useState(initialReviewer);
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

    axios
      .post(
        `${apiRootURL}/reviewers/`, 
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data', 
          }
        }
      )
      .then(response => {
        setReviewer(initialReviewer)
      })
      .catch(error => {
        console.log(error.response.data)
      })
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
            Bye
          </button>
        </div>

        <div className="reviewer-content">
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

            <button type="submit" className="submit-button">Create</button>
          </form>
        </div>
      </section>
    );
  };
  export default CreateReviewer;
