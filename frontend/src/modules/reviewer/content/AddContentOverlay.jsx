import React, { useContext, useState } from 'react'
import { TitleContext, WillAddAContentContext } from './Main'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import PropTypes from 'prop-types'

function AddContentOverlay({ reviewer }) {
  const [titles, setTitles] = useContext(TitleContext)
  const [_, setWillAddContent] = useContext(WillAddAContentContext)
  const [contentInputText, setContentInputText] = useState('')

  const addNewContent = (event) => {
    event.preventDefault()

    axios
      .post(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/`,
        { content: contentInputText }
      )
      .then(response => {
        const newTitles = [...titles, ...response.data]
        setTitles(newTitles)
        setContentInputText('')  // Clear input after successful submission
        console.log('success')
        setWillAddContent(false) // Hide overlay after submitting
      })
      .catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="content-overlay">
  <form onSubmit={addNewContent}>
    <div>
      <label htmlFor="content"></label>

      <textarea
        className="new-content"
        id="content"
        placeholder="Enter your content here..."
        value={contentInputText}
        onChange={e => setContentInputText(e.target.value)}
      ></textarea> 
    </div>

    <div className="buttons-container">
      <button
        className="add-content-button"
        type="submit"
      >
        Add
      </button>
      <button
        className="close-button"
        onClick={() => setWillAddContent(false)}
      >
        Close
      </button>
    </div>
  </form>
</div>

  )
}

AddContentOverlay.propTypes = {
  reviewer: PropTypes.shape({
    reviewer: PropTypes.string.isRequired
  })
}

export default AddContentOverlay
