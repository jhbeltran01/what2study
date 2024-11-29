import React, { useEffect, useState } from 'react'
import { apiRootURL } from '@root/globals'
import axios from 'axios'
import Card from './Card'
import { STUDYPOD_CREATE } from '@root/routes/constants'
import { Link } from 'react-router-dom';

function Content() {
  const [studypods, setStudypods] = useState([])
  const [searchQuery, setSearchQuery] = useState('')

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
  }

  const filteredStudypods = studypods.filter(pod =>
    pod.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='mt-[2rem]'>
      <div className='flex justify-between items-center mb-[1rem]'>
        <input 
          type="text" 
          value={searchQuery}
          onChange={handleSearch} 
          placeholder="Search..." 
          className="search-bar2"
        />
        <Link to={STUDYPOD_CREATE} className="btn-add">Add</Link>
      </div>

      <div className='grid grid-responsive-1'>
        {
          filteredStudypods.map((group) => {
            return <Card
              key={group.slug}
              studypod={group}
            />
          })
        }
      </div>
    </div>
  )
}

export default Content