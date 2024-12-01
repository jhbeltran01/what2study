import React, { useContext } from 'react'
import { SocketContext } from './Main'

function Header({numberOfConnectedUsers=0, moderator=null, numberOfSubmissions=0, displayReviewers}) {
  const socket = useContext(SocketContext)

  const goToReviewersList = () => {
    const message = JSON.stringify({
        action: "RETRIEVE_REVIEWER_LIST"
    })
    socket.send(message)
  }

  return (
    <div className='mb-[2rem]'>
      <div className='flex justify-between mb-[1rem]'>
        {
          !displayReviewers
          ? <button onClick={goToReviewersList} className='mb-[2rem]'>
              &lt;- Reviewers List
            </button>
          : <p></p>
        }

        <div className='flex gap-[20px]'>
          <p>Moderator: {moderator ? moderator.username : 'No moderator'}</p>
          <p>Submissions: {numberOfSubmissions}/{numberOfConnectedUsers} </p>
        </div>
      </div>
    </div>
  )
}

export default Header
