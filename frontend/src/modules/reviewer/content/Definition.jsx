import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals';
import { makeTextareaHeightToBeResponsive, performDeleteDefinition } from './services';
import { ContentContext } from './Title';
import { TitleContext } from './Main';

function Definition({definition, titleSlug}) {
  const [inputText, setInputText] = useState(definition.text)
  const [text, setText] = useState(definition.text)
  const reviewer = useSelector(state => state.reviewer.value)
  const [titles, setTitles] = useContext(TitleContext)
  const [deleteIsHovered, setDeleteIsHovered] = useState(false)
  const textareaRef = useRef()

  useEffect(() => {
    makeTextareaHeightToBeResponsive(textareaRef.current)
    setInputText(textareaRef.current.value)
  }, [])

  const updateDefinition = (event, titleSlug, definitionSlug) => {
    handleDefinitionTextChange(event)

    if (inputText == text) { return }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${titleSlug}`
        + `/definition/${definition.slug}/`,
        {text: inputText}
      )
      .then(response => {
        updateUIOnDefinitionUpdate(response.data.text, titleSlug, definitionSlug)
        setText(response.data.text)
      })
      .catch(err => {
        console.log(err.request.data)
      })
    
    setDeleteIsHovered(false)
  }

  const updateUIOnDefinitionUpdate = (text, titleSlug, definitionSlug) => {
    const tempTitles = titles.map(title => {
      if (!title.slug == titleSlug) {
        return title
      }

      const tempTitle = {...title}
        
      tempTitle.content = title.content.map(content => {
        if (definitionSlug == content.slug) {
          return {...content, text: text}
        }
        return content
      })

      return tempTitle
    })
    setTitles(tempTitles)
  }

  const handleDefinitionTextChange = (event) => {
    makeTextareaHeightToBeResponsive(event.target)
    setInputText(event.target.value)
  }

  const deleteADefinition = async () => {
    const [isSuccessful] = await performDeleteDefinition(
      reviewer.reviewer,
      titleSlug,
      definition.slug,
    )
    if (!isSuccessful) { return }

    setDeleteIsHovered(false)
    updateUIOnDefinitionDelete(definition.slug, titleSlug)
  }

  const updateUIOnDefinitionDelete = (definitionSlug, titleSlug) => {
    const tempTitles = titles.map(title => {
      if (title.slug != titleSlug) { return title }

      const tempTitle = {...title}
      tempTitle.content = title.content.filter(content => content.slug != definitionSlug)
      return tempTitle
    })

    setTitles(tempTitles)
  }
  
  return (
    <li>
      <div className='flex gap-[10px]'>
        <textarea
          className='w-[100%] textarea-1 h-[auto]'
          onChange={handleDefinitionTextChange}
          onFocus={handleDefinitionTextChange}
          value={inputText}
          onBlur={(e) => updateDefinition(e, titleSlug, definition.slug)}
          ref={textareaRef}
        ></textarea>
        <button 
          className={`delete ${!deleteIsHovered && 'hidden'}`}
          onMouseOver={() => setDeleteIsHovered(true)}
          onClick={deleteADefinition}
        >
          Delete
        </button>
      </div>
    </li>
  )
}

Definition.propTypes = {
  definition: PropTypes.shape({
    text: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  titleSlug: PropTypes.string.isRequired,
  deleteAContent: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
}

export default Definition
