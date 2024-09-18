import React, { useEffect } from 'react'
import axios from 'axios'
import { apiRootURl } from '@root/globals'
import { useSelector } from 'react-redux';

function Main() {
  const room = useSelector(state => state.studypod.value)
  useEffect(() => {
    axios
      .post(`${apiRootURl}/studypods/get-encrypted-id/`)
      .then(response => {
        const encryptedData = response.data.data.toString()
        window.open(`https://127.0.0.1:8081/?encryptedData=${encryptedData}&roomName=${room.name}`, '_blank', 'noopener,noreferrer')
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  return (
    <div>
      <h1>Video Conference 1</h1>
    </div>
  )
}

export default Main
