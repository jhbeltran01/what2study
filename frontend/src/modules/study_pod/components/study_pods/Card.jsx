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
    <div className='subject-button'>
      <div className="subject-title-container">
        <p className="subject-title">{studypod.name}</p>
      </div>
      
      <div className='subject-content flex-col pb-[1rem] mt'>
        <p>{studypod.access_code}</p>

        <div className='flex'>
          <Link
            className='view-link'
            to={STUDYPOD_START_REVIEWER}
            onClick={() => dispatch(setStudypod(studypod))}
          >
            Join
          </Link>
          <Link
            className='view-link'
            to={STUDYPOD_CONTENT}
            onClick={() => dispatch(setStudypod(studypod))}
          >
            View
          </Link>
        </div>
      </div>
    </div>
  )
}

Card.propTypes = {
  studypod: PropTypes.object.isRequired,
};


export default Card
