import PropTypes from 'prop-types'
import React from 'react'

function Card({subject}) {
  return (
    <div>
      <p>{subject.name}</p>

      <div>
        <span>{subject.number_of_reviewers} Reviewers</span>
        <span>&nbsp;•&nbsp;</span>
        <span>{subject.number_of_notes} Notes</span>
      </div>
    </div>
  )
}

Card.propTypes = {
  subject: PropTypes.shape({
    name: PropTypes.string.isRequired,
    number_of_reviewers: PropTypes.number.isRequired,
    number_of_notes: PropTypes.number.isRequired,
  })
}

export default Card
