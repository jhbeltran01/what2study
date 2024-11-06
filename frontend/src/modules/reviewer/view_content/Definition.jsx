import PropTypes from 'prop-types'
import React from 'react'

function Definition({definition}) {
  return (
    <div className='px-[1em]'>
      {definition.text}
    </div>
  )
}

Definition.propTypes = {
  definition: PropTypes.shape({
    text: PropTypes.string.isRequired
  })
}

export default Definition
