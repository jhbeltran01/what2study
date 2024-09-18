import React from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { JOIN_CALL } from '@root/routes/constants';
import { setStudypod } from "@redux/studypod"
import { useDispatch } from 'react-redux';


function Card({studypod}) {
  const dispatch = useDispatch()

  return (
    <div>
      <h1>{studypod.name}</h1>
      <Link 
        to={JOIN_CALL}
        onClick={() => dispatch(setStudypod(studypod))}
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
