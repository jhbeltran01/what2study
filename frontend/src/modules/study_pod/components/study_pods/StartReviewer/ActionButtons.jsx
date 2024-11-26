import React, { useContext } from 'react'
import { SocketContext } from './Main'

function ActionButtons() {
  const socket = useContext(SocketContext)

  const beTheModerator = () => {
    const message = JSON.stringify({
      action: "UPDATE_MODERATOR",
      unset_moderator: true
    })
    console.log(message)
    socket.send(message)
  }
  
  const generateQuestions = () => {
    const message = JSON.stringify({
      action: "GENERATE_QUESTION",
      number_of_questions: 1
    })
    socket.send(message)
  }
  
  const showResults = () => {
    const message = JSON.stringify({
      action: "SHOW_RESULTS"
    })
    socket.send(message)
  }

  return (
    <div className='flex flex-col gap-[10px] action-buttons'>
      <button onClick={generateQuestions} className='submit-button'>Generate Question</button>
      <button onClick={beTheModerator} className='submit-button'>Be the moderator</button>
      <button onClick={showResults} className='submit-button'>Show Results</button>
    </div>
  )
}

export default ActionButtons
