import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { JOIN_CALL } from '@root/routes/constants';
import { setStudypod } from "@redux/studypod"
import { useDispatch } from 'react-redux';
import { STUDYPOD_CONTENT, STUDYPOD_START_REVIEWER } from '@root/routes/constants';


function Card({studypod}) {
  const dispatch = useDispatch()

  return (
    <div>
      <h1>{studypod.name}</h1>
      <Link 
        to={STUDYPOD_START_REVIEWER}
        onClick={() => dispatch(setStudypod(studypod))}
      >
        Join
      </Link>
      <Link 
        to={STUDYPOD_CONTENT}
        onClick={() => dispatch(setStudypod(studypod))}
      >
        View
      </Link>
    </div>
  )
}

Card.propTypes = {
  studypod: PropTypes.object.isRequired,
};


export default Card
