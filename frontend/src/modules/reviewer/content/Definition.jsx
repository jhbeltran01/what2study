import PropTypes from 'prop-types'
import React from 'react'

function Definition({definition}) {
  return (
    <li>
      <p>{definition.text}</p>
    </li>
  )
}

Definition.propTypes = {
  definition: PropTypes.shape({
    text: PropTypes.string.isRequired
  }).isRequired
}

export default Definition
