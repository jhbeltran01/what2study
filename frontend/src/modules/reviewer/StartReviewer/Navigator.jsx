import PropTypes from 'prop-types'
import React from 'react'

function Navigator({handlePrevious, handleNext, generateNewQuestions, isSubmitted}) {
  return (
    <div className='grid grid-2-column-3 max-w-[400px] gap-[10px] mt-[2rem] mx-[auto]'>
      <button type="button" className="prev-button" onClick={handlePrevious}>
        Previous
      </button>

      <button type="button" className="next-button" onClick={handleNext}>
        Next
      </button>

      {
        isSubmitted
        && <div className='grid-2-col-span-1'>
            <button
                className='submit-button'
                onClick={generateNewQuestions}
              >
                Generate New Questions
              </button>
        </div>
      }
    </div>
  )
}

Navigator.propTypes = {
  handlePrevious:  PropTypes.func.isRequired,
  handleNext: PropTypes.func.isRequired,
  generateNewQuestions: PropTypes.func.isRequired,
  isSubmitted: PropTypes.bool.isRequired,
}

export default Navigator
