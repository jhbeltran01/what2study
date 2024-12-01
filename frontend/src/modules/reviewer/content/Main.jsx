import axios from 'axios'
import React, { createContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import Title from './Title'
import * as constants from './constants'
import AddContentOverlay from './AddContentOverlay'
import Options from './Options'
import { START_REVIEWING } from '@root/routes/constants'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'; // Import useNavigate


export const TitleContext = createContext()
export const EnumTitleContext = createContext()
export const WillAddAContentContext = createContext()

function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [titles, setTitles] = useState([])
  const [text, setText] = useState({isUpdated: false, slug: '', text: ''})
  const [willAddContent, setWillAddContent] = useState(false)
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Add reviewer to recently viewed
    axios
      .post(
        `${apiRootURL}/reviewers/public/recently-viewed/add/`
        + `?reviewer=${reviewer.slug}&is_public=${reviewer.is_public}`
      )
      .then((response) => {
        console.log(response.status);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [reviewer]);


  const handleTitleClick = () => {
    navigate('/reviewers'); // Redirect to Reviewer page
  };

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
  
  return (
    <WillAddAContentContext.Provider value={[willAddContent, setWillAddContent]}>
      <EnumTitleContext.Provider value={[text, setText]}>
        <TitleContext.Provider value={[titles, setTitles]}>
          <div className='main-content'>
            <div className='main-content-options'>
            <button className='content-back-reviewer-button' onClick={handleTitleClick}>Back</button>
              <h1 className='header-title'>{reviewer.name}</h1>
              <div className='review-addcontent-button'>
                <Link to={START_REVIEWING}>Start Reviewer</Link>
                <button className='content-button' onClick={() => setWillAddContent(!willAddContent)}>Add Content</button>
                <Options reviewer={reviewer} />
              </div>
            </div>

            <ul className='content-list'>
              {titles.map((title, index) => {
                if (title.content == undefined) { return '' }
                
                const isEnumerationTitle = title.t_type === constants.ENUMERATION_TITLE
                const hasNoDefinition = title.content.length == 0;
                if (isEnumerationTitle && hasNoDefinition && title.is_in_enumeration) {
                  //return ''
                  return ''
                }

                return <Title title={title} index={index} key={title.slug} />
              })}
            </ul>


            <div>
            {willAddContent && <AddContentOverlay reviewer={reviewer} />}
          </div>
          </div>

        </TitleContext.Provider>
      </EnumTitleContext.Provider>
    </WillAddAContentContext.Provider>
  )
}

export default Main