import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals';
import { makeTextareaHeightToBeResponsive, performDeleteDefinition } from './services';
import { TitleContext } from './Main';
import { ContentContext } from './Title';

/** @TODO strip the text before saving to the database */
function Definition({definition, titleSlug, deleteAContent, index}) {
  const [inputText, setInputText] = useState(definition.text)
  const [text, setText] = useState(definition.text)
  const reviewer = useSelector(state => state.reviewer.value)
  const [deleteIsHovered, setDeleteIsHovered] = useState(false)
  const [content] = useContext(ContentContext)

  useEffect(() => {
    setInputText(definition.text)
  }, [content])

  const updateDefinition = (event) => {
    handleDefinitionTextChange(event)

    if (inputText == text) { return }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${titleSlug}`
        + `/definition/${definition.slug}/`,
        {text: inputText}
      )
      .then(response => {
        setText(response.data.text)
        setInputText(response.data.text)
      })
      .catch(err => {
        console.log(err.request.data)
      })
    
    setDeleteIsHovered(false)
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
    deleteAContent(index)
  }
  
  return (
    <li>
      <div className='flex gap-[10px]'>
        <textarea
          className='w-[100%] textarea-1 h-[auto]'
          onChange={handleDefinitionTextChange}
          onFocus={handleDefinitionTextChange}
          value={inputText}
          onBlur={updateDefinition}
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
