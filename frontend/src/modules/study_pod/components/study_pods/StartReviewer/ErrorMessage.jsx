import React from 'react'

function ErrorMessage({message}) {
  return (
    <div className='error-message-2 flex justify-center'>
      <div className='submit-error'>{message}</div>
    </div>
  )
}

export default ErrorMessage
