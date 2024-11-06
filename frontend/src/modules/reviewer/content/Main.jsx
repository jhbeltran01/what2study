import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import Title from './Title'
import * as constants from './constants'
import AddContentOverlay from './AddContentOverlay'
import Options from './Options'

export const TitleContext = createContext()
export const EnumTitleContext = createContext()
export const WillAddAContentContext = createContext()

function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [titles, setTitles] = useState([])
  const [text, setText] = useState({isUpdated: false, slug: '', text: ''})
  const [willAddContent, setWillAddContent] = useState(false)

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
  
  return (
    <WillAddAContentContext.Provider value={[willAddContent, setWillAddContent]}>
      <EnumTitleContext.Provider value={[text, setText]}>
        <TitleContext.Provider value={[titles, setTitles]}>
          <div className='relative pt-[3em]'>
            <div className='p-[1em] flex items-center justify-between header-1'>
              <h1>{reviewer.name}</h1>

              <div className='flex items-center gap-[10px]'>
                <button onClick={() => setWillAddContent(!willAddContent)}>Add Content</button>

                  <Options reviewer={reviewer} />
              </div>
            </div>
            <ul>
              {titles.map((title, index) => {
                if (title.content == undefined) { return '' }
                
                const isEnumerationTitle = title.t_type === constants.ENUMERATION_TITLE
                const hasNoDefinition = title.content.length == 0;
                if (isEnumerationTitle && hasNoDefinition && title.is_in_enumeration) {
                  return ''
                }

                return <Title title={title} index={index} key={title.slug} />
              })}
            </ul>
          </div>
          <div>
            {willAddContent && <AddContentOverlay reviewer={reviewer} />}
          </div>
        </TitleContext.Provider>
      </EnumTitleContext.Provider>
    </WillAddAContentContext.Provider>
  )
}

export default Main
