import axios from 'axios'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals';
/** @TODO strip the text before saving to the database */
function Definition({definition, titleSlug}) {
  const [inputText, setInputText] = useState(definition.text)
  const [text, setText] = useState(definition.text)
  const reviewer = useSelector(state => state.reviewer.value)

  const updateDefinition = () => {
    if (inputText == text) { return }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${titleSlug}`
        + `/definition/${definition.slug}/`,
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

  return (
    <li>
      <textarea 
        className='w-[100%]'
        onChange={(e) => setInputText(e.target.value)}
        value={inputText}
        onBlur={updateDefinition}
      ></textarea>
    </li>
  )
}

Definition.propTypes = {
  definition: PropTypes.shape({
    text: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
  }).isRequired,
  titleSlug: PropTypes.string.isRequired
}

export default Definition
