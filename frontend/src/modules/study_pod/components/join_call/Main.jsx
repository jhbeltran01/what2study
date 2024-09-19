import React, { useEffect } from 'react'
import axios from 'axios'
import { apiRootURl, conferenceCallServer } from '@root/globals'
import { useSelector } from 'react-redux';
// import Question from './Question/Question';

function Main() {
  const room = useSelector(state => state.studypod.value)

  useEffect(() => {
    axios
      .post(`${apiRootURl}/studypods/get-encrypted-id/`)
      .then(response => {
        const encryptedData = response.data.data.toString()
        window.open(
          `${conferenceCallServer}/?encryptedData=${encryptedData}&roomName=${room.name}`, 
          '_blank', 
          'noopener,noreferrer'
        )
      })
      .catch(err => {
        console.log(err)
      })
  }, [room])

  return (
    <div>
      {/* <Question /> */}
      <h1>Video Conference</h1>
    </div>
  )
}

export default Main
