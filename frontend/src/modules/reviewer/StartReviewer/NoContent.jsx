import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import formatImage from '@assets/format.png'; // Import the image

function NoContent() {
  const navigate = useNavigate(); // Initialize useNavigate

  const handleTitleClick = () => {
    navigate('/reviewers/content'); // Navigate to the specified route
  };

  return (
    <section className="no-content-section p-4 flex flex-col">
      <div className="no-content-header flex items-center justify-between mb-4">
        <button className="no-content-header-title" onClick={handleTitleClick}>
          {'← Back'}
        </button>
      </div>

      <div className="no-content-container">
        <p className="no-content-message">
          Oops! This reviewer doesn't have enough content to generate questions. Please add more details, such as titles with definitions, lists of items, or descriptions of processes, to get started. Please see the image below to follow a proper format.
        </p>
        <img 
          src={formatImage} 
          alt="Proper Format Example" 
          className="no-content-image" 
        />
      </div>
    </section>
  );
}

export default NoContent;
