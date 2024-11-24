import React from 'react'

interface MyComponentProps {
  message: string
}

const ErrorMessage: React.FC<MyComponentProps> = ({message}) => {
  return (
    <div className='error-message flex justify-center'>
      <div className='submit-error'>{message}</div>
    </div>
  )
}

export default ErrorMessage
