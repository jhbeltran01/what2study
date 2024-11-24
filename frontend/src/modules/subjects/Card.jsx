import PropTypes from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSubject } from '@redux/subject';
import { SUBJECT_CONTENT } from '@root/routes/constants';

function Card({ subject }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const redirectToSubjectContent = () => {
    dispatch(setSubject(subject));
    navigate(SUBJECT_CONTENT);
  };

  return (
    <button 
      className="subject-button" 
      onClick={redirectToSubjectContent}
    >
      <div className="subject-title-container">
        <p className="subject-title">{subject.name}</p>
      </div>
      <div className="subject-content">
        <span className="subject-stat">{subject.number_of_reviewers} Reviewers</span>
        <span>&nbsp;•&nbsp;</span>
        <span className="subject-stat">{subject.number_of_notes} Notes</span>
      </div>
    </button>
  );
}

Card.propTypes = {
  subject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    number_of_reviewers: PropTypes.number.isRequired,
    number_of_notes: PropTypes.number.isRequired,
  }),
};

export default Card;