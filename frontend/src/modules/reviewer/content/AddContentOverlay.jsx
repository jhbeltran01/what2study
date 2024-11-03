import React, { useContext, useState } from 'react'
import { TitleContext, WillAddAContentContext } from './Main'
import axios from 'axios'
import { apiRootURL } from '@root/globals'
import PropTypes from 'prop-types'
/**@TODO when deleting an enumeration, it is not deleted on the UI */
function AddContentOverlay({reviewer}) {
  const [titles, setTitles] = useContext(TitleContext)
  const [_, setWillAddContent] = useContext(WillAddAContentContext)
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
      <div className='form-1'>
        <div className='text-right mb-[1rem]'>
          <button 
            className='btn-3'
            onClick={() => setWillAddContent(false)}
          >
            Close
          </button>
        </div>

        <form onSubmit={addNewContent}>
          <div>
            <label htmlFor="content"></label>

            <textarea
              className='textarea-2 mb-[1rem]'
              id="content"
              onChange={e => setContentInputText(e.target.value)}
              onBlur={addNewContent}
            ></textarea> <br />
          </div>
        
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
    </div>
  )
}

AddContentOverlay.propTypes = {
  reviewer: PropTypes.shape({
    reviewer: PropTypes.string.isRequired
  })
}

export default AddContentOverlay
