import React from 'react'
import Choice from './Choice'

function MultipleChoice() {
  return (
    <div>
      <div>
        <h3 className='question__number'>Question 5</h3>
        <p className='question__text'>What is the main purpose of using middleware in integrative programming?</p>
      </div>

      <hr className='mb-1' />

      <div>
        <Choice />
        <Choice />
        <Choice />
        <Choice />
      </div>
    </div>
  )
}

export default MultipleChoice
