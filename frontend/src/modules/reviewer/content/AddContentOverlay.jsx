import React, { useContext, useState } from 'react'
import { TitleContext, WillAddAContentContext } from './Main'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import PropTypes from 'prop-types'
/**@TODO when deleting an enumeration, it is not deleted on the UI */
function AddContentOverlay({reviewer}) {
  const [titles, setTitles] = useContext(TitleContext)
  const [willAddContent, setWillAddContent] = useContext(WillAddAContentContext)
  const [contentInputText, setContentInputText] = useState('')

  const addNewContent = (event) => {
    event.preventDefault()

    axios
      .post(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/`,
        {content: contentInputText}
      )
      .then(response => {
        const newTitles = [...titles, ...response.data]
        setTitles(newTitles)
        setContentInputText()
        console.log('success')
        setWillAddContent(false)
      })
      .catch(err => {
        console.log(err)
      })
      
  }

  return (
    <div className='overlay-1 flex justify-center items-center'>
      <form onSubmit={addNewContent}  className='form-1'>
        <label htmlFor="content"></label>
        <textarea 
          className='textarea-2 mb-[1rem]'
          id="content"
          onChange={e => setContentInputText(e.target.value)}
          onBlur={addNewContent}
        ></textarea> <br />
        <div className='text-right'>
          <button 
            className='btn-3' 
            type='submit'
          >
            Add Content
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
