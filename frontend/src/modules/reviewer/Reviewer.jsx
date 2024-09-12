import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import blueIcon from '@assets/blue.png';
import createIcon from '@assets/create.png'; // Import the create icon
import floralIcon from '@assets/floral.png';
import pinkIcon from '@assets/pink.png';
import searchIcon from '@assets/search.png';
import skyIcon from '@assets/sky.png';


const Reviewers = () => {
  const [active, setActive] = useState('my-reviewers');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleClick = (section) => {
    setActive(section);
  };

  const handleCreateClick = () => {
    navigate('/Reviewers2'); // Redirect to /Reviewers2
  };

  const images = [floralIcon, pinkIcon, blueIcon, skyIcon];

  return (
    <React.Fragment>
      <section className="h-screen p-4 flex flex-col">
        <div className="header mb-4">
          <div className="header-buttons">
            <button
              onClick={() => handleClick('my-reviewers')}
              className={active === 'my-reviewers' ? 'active' : ''}
            >
              My Reviewers
            </button>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              className="search-bar"
            />
            <img src={searchIcon} alt="Search" className="search-icon" />
          </div>
        </div>

        <div className="content-container">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className={`content-box ${index === 0 ? 'first-box' : ''}`}
              onClick={index === 0 ? handleCreateClick : undefined} // Add onClick handler
            >
              <div className="icon">
                {index === 0 ? (
                  <>
                    <img src={createIcon} alt="Create Icon" className="create-icon" />
                    <div className="create-text">Create</div> {/* Ensure this is included */}
                  </>
                ) : (
                  <img src={images[index % images.length]} alt="Icon" />
                )}
              </div>
              <div className="content-text">
                {/* Text for non-first boxes */}
                {index !== 0 && <p>{`Subject ${index + 1}`}</p>}
              </div>
            </div>
          ))}
        </div>
      </section>
    </React.Fragment>
  );
};

export default Reviewers;
