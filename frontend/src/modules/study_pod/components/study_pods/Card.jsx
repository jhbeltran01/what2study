import React, { useContext } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { JOIN_CALL } from '@root/routes/constants';
import { StudyPodContext } from '@root/App';


function Card({studypod}) {
  const studypodContext = useContext(StudyPodContext)
  
  const setSelectedStudyPod = () => {
    studypodContext.dispatch({payload: studypod})
  }

  return (
    <div>
      <h1>{studypod.name}</h1>
      <Link 
        to={JOIN_CALL}
        onClick={setSelectedStudyPod}
      >
        Join
      </Link>
    </div>
  )
}

Card.propTypes = {
  studypod: PropTypes.object.isRequired,
};


export default Card
