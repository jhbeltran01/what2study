import PropTypes from 'prop-types'
import React, { useState } from 'react'
import * as constants from './constants'
import Definition from './Definition'
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';
import { performAddNewDefinition } from './services';

/**
 * @TODO when updating a title, do not include the content on the returned data 
*/
function Title({title}) {
  
  const isEnumerationAnswer = title.content.length === 0
  const isEnumerationTitle = title.t_type === constants.ENUMERATION
  const isDefinitionTitle = title.t_type === constants.DEFINITION
  const [content, setContent] = useState(title.content);
  const [inputText, setInputText] = useState(title.text)
  const [text, setText] = useState(title.text)
  const reviewer = useSelector(state => state.reviewer.value)
  const [willAddAContent, setWillAddAContent] = useState(false)
  const [newContentValue, setNewContentValue] = useState('')

  const updateTitle = () => {
    if (inputText == text) { return }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${title.slug}/`,
        {text: inputText}
      )
      .then(response => {
        console.log(response.status)
        setText(inputText)
      })
      .catch(err => {
        console.log(err.request.data)
      })
  }

  const addAContent = async () => {
    if (isDefinitionTitle) {
      const [isSuccesfull, newDefinition] = await performAddNewDefinition(reviewer.reviewer, title.slug, newContentValue)
      console.log(isSuccesfull, newDefinition)
      if (!isSuccesfull) { return }
      setContent([...content, newDefinition])
    }

    setWillAddAContent(false)
    setNewContentValue('')
  }

  const headerBtns = (
    <div className='flex gap-[10px]'>
      <button onClick={() => setWillAddAContent(true) }>Add</button>
      <button>Delete</button>
      {isEnumerationTitle && <button>Order</button>}
    </div>
  )

  return (
    <li className={`${!isEnumerationAnswer && 'm-[1rem]'}`}>
      <div className='flex gap-[10px]'>
        <input 
          className='w-[100%]'
          type="text" 
          value={inputText} 
          onChange={(e) => setInputText(e.target.value)}
          onBlur={updateTitle}
        />
        {!isEnumerationAnswer && headerBtns}
      </div>
      <ul className='px-[1em]'>
        {content.map((content, index) => {
          switch(title.t_type) {
            case constants.DEFINITION:
            case constants.ENUMERATION_TITLE:
              return <Definition definition={content} titleSlug={title.slug} key={index}/>
            case constants.ENUMERATION:
              return <Title title={content} key={index} />
          }
        })}
        <li>
          {
            willAddAContent 
            && <textarea 
              className='w-[100%] text-red-700'
              value={newContentValue}
              onChange={(e) => setNewContentValue(e.target.value)}
              onBlur={addAContent}
            ></textarea> 
          }
        </li>
      </ul>
    </li>
  )
}

Title.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    t_type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
  }).isRequired
}
export default Title
