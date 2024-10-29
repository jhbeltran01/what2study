import React, { useEffect, useState } from 'react'
import { apiRootURL } from '@root/globals'
import axios from 'axios'
import Card from './Card'

function Content() {
  const [studypods, setStudypods] = useState([])

  useEffect(() => {
    const url = `${apiRootURL}/studypods/`

    axios
      .get(url)
      .then(response => {
        setStudypods(response.data.results)
      })
      .catch(error => {
        console.log(error)
      })
  }, [])


  return (
    <div>
      {
        studypods.map((group) => {
          return <Card 
            key={group.id}
            studypod={group}
          />
        })
      }
    </div>
  )
}

export default Content
