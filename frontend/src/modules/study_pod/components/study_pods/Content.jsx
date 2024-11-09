import React, { useEffect, useState } from 'react'
import { apiRootURL } from '@root/globals'
import axios from 'axios'
import Card from './Card'
import { STUDYPOD_CREATE } from '@root/routes/constants'
import { Link } from 'react-router-dom';

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
    <div className='mt-[2rem]'>
      <div className='text-right'>
        <Link to={STUDYPOD_CREATE}>Add</Link>
      </div>

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
    </div>
  )
}

export default Content
