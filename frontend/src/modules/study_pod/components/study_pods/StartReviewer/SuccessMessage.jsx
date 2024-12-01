import React from 'react'

function SuccessMessage({messages}) {
  console.log(messages)
  return (
    <div className='error-message-2 flex flex-col items-center gap-[10px]'>
      {messages.map(message => (
        <div className={`${message.isError? 'submit-error': 'submit-success'}`} key={message.id}>{message.text}</div>
      ))}
    </div>
  )
}

export default SuccessMessage
