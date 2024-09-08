import React from 'react';

const CreateReviewer = () => {
  return (
    <React.Fragment>
      <section className="container">
        <div className="input">
          <label htmlFor="reviewer-name">Reviewer Name</label>
          <div className="input-field">
            <input
              id="reviewer-name"
              type="text"
              placeholder="Enter reviewer name"
            />
          </div>
        </div>
      </section>
    </React.Fragment>
  );
};

export default CreateReviewer;