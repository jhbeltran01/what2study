import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import axios from 'axios'
import Title from './Title'

function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [titles, setTitles]  = useState([])

  useEffect(() => {
    if (!reviewer.is_public) { return }
    
    /** add reviewer to recently viewed */
    axios
      .post(
        `${apiRootURL}/reviewers/public/recently-viewed/add/`
        + `?reviewer=${reviewer.slug}`
      )
      .then(response => {
        console.log(response.status)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  useEffect(() => {
    /** Get the content of the reviewer */
    axios
      .get(
        `${apiRootURL}/reviewers/public/${reviewer.reviewer}/`
        + '?is_get_content=True&is_partial=True'
      )
      .then(response => {
        setTitles(response.data.titles)
        console.log(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  },[])

  return (
    <ul className='p-[1em]'>
      {titles.map(title => <Title title={title} key={title.slug} />)}
    </ul>
  )
}

export default Main
