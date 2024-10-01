import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
//import '../../../sass/pages/_reviewer.scss';

const ViewReviewer = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { reviewer } = location.state || {};

  if (!reviewer) {
    navigate('/reviewers');
    //return null;
  }

  const handleTitleClick = () => {
    navigate('/reviewers');
  };

    const handleStartClick = () => {
      navigate('/start-review');
    };

  return (
    <section className="homepage-section p-4 flex flex-col">
      <div className="reviewer-content">

      <div className="header">
            <button className="header-title" onClick={handleTitleClick}>
              {'← Back to Reviewers'}
            </button>
          </div>

        <div className="reviewer-entry">

          <div className="reviewer-header">
            <h2 className="reviewer-title">{reviewer.name}</h2>
            <div className="reviewer-info">
              <span className="reviewer-type">{reviewer.type}</span>
              <span className="reviewer-date">{reviewer.date}</span>
            </div>
            <p className="reviewer-description">
              Description: {reviewer.description}
            </p>
          </div>

          <p className="reviewer-created-by">
            Created by: {reviewer.createdBy}
          </p>

          <hr className="divider" />

          <div className="grade-container">
            <div className="grade-description-wrapper">
              <div className="grade-receive">Receive Grade</div>
              <p className="grade-description">To Pass 90% or higher</p>
            </div>

            <div className="vertical-line"></div>

            <div className="grade-title-wrapper">
              <div className="grade-title">Your Grade</div>
              <p className="grade-info">-</p>
            </div>

            <div className="start-button-container">
            <button className="start-button" onClick={handleStartClick}>
              Start
            </button>
          </div>
          </div>
            <hr className="divider" />
        </div>
      </div>
    </section>
  );
};

export default ViewReviewer;
