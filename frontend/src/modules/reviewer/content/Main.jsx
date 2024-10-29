import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import Title from './Title'
/** 
 * @TODO when updating the recently viewed, instead of fetching
 * the reviewer, convert it to a try-catch block
 */
function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [titles, setTitles] = useState([])

  useEffect(() => {
    /** Get the content of the reviewer */
    axios
      .get(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/`
        + '?is_get_content=True&is_partial=True'
      )
      .then(response => {
        setTitles(response.data.titles)
      })
      .catch(err => {
        console.log(err)
      })
  },[])

  useEffect(() => {
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

  return (
    <div>
      <h1 className='mb-[2rem]'>{reviewer.name}</h1>

      <ul>
        {titles.map((title, index) => <Title title={title} key={index} />)}
      </ul>
    </div>
  )
}

export default Main
