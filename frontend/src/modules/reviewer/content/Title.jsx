import PropTypes from 'prop-types'
import React, { createContext, useContext, useEffect, useState } from 'react'
import * as constants from './constants'
import Definition from './Definition'
import axios from 'axios';
import { apiRootURL } from '@root/globals';
import { useSelector } from 'react-redux';
import { makeTextareaHeightToBeResponsive, performAddNewDefinition, performAddNewEnumerationTitle, performDeleteEnumerationTitle, performDeleteTitle } from './services';
import { EnumTitleContext, TitleContext } from './Main';

export const ContentContext = createContext()

function Title({title, index=null, titleSlug=null, setContentParent=null, contentParent=null}) {
  const isEnumerationTitle = title.content.length === 0 && title.t_type != constants.DEFINITION && title.is_in_enumeration
  const isEnumerationTitleWithDefinition = title.t_type == constants.ENUMERATION_TITLE && title.content.length > 0
  const isEnumeration = title.t_type === constants.ENUMERATION
  const isDefinitionTitle = title.t_type === constants.DEFINITION
  const [content, setContent] = useState(title.content ? title.content : []);
  const [inputText, setInputText] = useState(title.text)
  const [text, setText] = useState(title.text)
  const reviewer = useSelector(state => state.reviewer.value)
  const [willAddAContent, setWillAddAContent] = useState(false)
  const [newContentValue, setNewContentValue] = useState('')
  const [titles, setTitles] = useContext(TitleContext)
  const [enumTitle, setEnumTitle] = useContext(EnumTitleContext)
  const [contentParentInContext] = useContext(ContentContext) || [null, () => {}];

  useEffect(() => {
    if (!enumTitle.isUpdated || title.slug != enumTitle.slug) { return }

    setInputText(enumTitle.text)
    setEnumTitle({isUpdated: false, slug: '', text: ''})
  }, [enumTitle])

  useEffect(() => {
    setInputText(title.text)
  }, [contentParentInContext])

  const updateTitle = () => {
    if (inputText == text) { return }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${title.slug}/`,
        {text: inputText}
      )
      .then(response => {
        const text = response.data.text
        setText(text)
        setInputText(text)
        setEnumTitle({isUpdated: true, slug: title.slug, text: text})
      })
      .catch(err => {
        console.log(err)
      })
  }

  const addAContent = async () => {
    let addingIsSuccessful = false
    if (isDefinitionTitle || isEnumerationTitle || isEnumerationTitleWithDefinition) {
      addingIsSuccessful = await addDefinition()
    }

    if (isEnumeration) {
      addingIsSuccessful = await addEnumerationTitle()
    }

    if (!addingIsSuccessful) { return }

    setWillAddAContent(false)
    setNewContentValue('')
  }

  const addDefinition = async () => {
    const [isSuccessful, newDefinition] = await performAddNewDefinition(
      reviewer.reviewer, 
      title.slug, 
      newContentValue
    )

    if (isSuccessful && (!isEnumerationTitle || isDefinitionTitle)) { 
      setContent([...content, newDefinition])
    }

    if (isSuccessful && isEnumerationTitle) {
      addDefinitionToEnumerationTitleContent(newDefinition, title.slug)
    }

    return isSuccessful
  }

  const addDefinitionToEnumerationTitleContent = (definition, selectedTitleSlug) => {
    const tempTitles = [...titles]
    for (let index = 0; index < tempTitles.length; ++index) {
      if (selectedTitleSlug == tempTitles[index].slug) {
        tempTitles[index].content.push(definition)
        break;
      }
    }
    setTitles(tempTitles)
  }

  const addEnumerationTitle = async () => {
    const [isSuccessful, newEnumTitle] = await performAddNewEnumerationTitle(
      reviewer.reviewer, 
      title.slug, 
      newContentValue
    )

    if (isSuccessful) {
      setContent([...content, newEnumTitle])
    }

    return isSuccessful
  }

  const deleteAContent = (innerIndex) => {
    /** When deleting an Enumeration content. Delete on the enumeration content */
    const isParentContent =  setContentParent != null
    let newContent = isParentContent ? [...contentParent] : [...content]
    const contentSetter = isParentContent ? setContentParent : setContent

    newContent.splice(innerIndex, 1)
    contentSetter(newContent)
  }

  const handleNewContentChange = (event) => {
    setNewContentValue(event.target.value)
    makeTextareaHeightToBeResponsive(event.target)
  }

  const deleteAnEnumTitle = async (innerIndex) => {
    const [isSuccessful] = await performDeleteEnumerationTitle(
      reviewer.reviewer,
      titleSlug,
      title.slug,
      isEnumerationTitleWithDefinition,
    )
    if (!isSuccessful) { return }

    if (isSuccessful && isEnumerationTitleWithDefinition) {
      const tempTitles = [...titles]
      tempTitles[index].content = []
      setTitles(tempTitles)
      return
    }

    deleteAContent(innerIndex)
  }

  const deleteATitle = async (innerIndex) => {
    const [isSuccessful] = await performDeleteTitle(
      reviewer.reviewer,
      title.slug
    )

    if (!isSuccessful) { return }

    deleteATitleInTheList(innerIndex)
  }

  const deleteATitleInTheList = (delIndex) => {
    const tempTitles = titles.map((title, innerIndex) => innerIndex != delIndex && title)
    setTitles(tempTitles)
  }

  const deleteTitleFunction = (isEnumerationTitle || isEnumerationTitleWithDefinition) 
    ? deleteAnEnumTitle
    : deleteATitle

    return (
    <ContentContext.Provider value={[content]}>
      <li className={`${!isEnumerationTitle && 'm-[1rem]'}`}>
        <div className='flex gap-[10px]'>
          <input
            className='w-[100%]'
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onBlur={updateTitle}
          />
          <div className='flex gap-[10px]'>
            <button onClick={() => setWillAddAContent(true) }>Add</button>
            <button onClick={() => deleteTitleFunction(index)}>Delete</button>
            {isEnumeration && <button>Order</button>}
          </div>
        </div>
        <ul className='px-[1em]'>
          {content.map((data, index) => {
            switch(title.t_type) {
              case constants.DEFINITION:
              case constants.ENUMERATION_TITLE:
                return <Definition
                          definition={data}
                          titleSlug={title.slug}
                          deleteAContent={deleteAContent}
                          index={index}
                          key={index}
                        />
              case constants.ENUMERATION:
                return <Title
                          title={data}
                          index={index}
                          titleSlug={title.slug}
                          setContentParent={setContent}
                          contentParent={content}
                          key={index}
                        />
            }
          })}
          <li>
            {
              willAddAContent && !isEnumeration
              && <textarea
                className='w-[100%] text-red-700'
                value={newContentValue}
                onChange={handleNewContentChange}
                onBlur={addAContent}
              ></textarea>
            }
            {
              willAddAContent && isEnumeration
              && <input
                className='w-[100%] text-red-700'
                value={newContentValue}
                onChange={handleNewContentChange}
                onBlur={addAContent}
              ></input>
            }
          </li>
        </ul>
      </li>
    </ContentContext.Provider>
  )
}

Title.propTypes = {
  title: PropTypes.shape({
    text: PropTypes.string.isRequired,
    t_type: PropTypes.string.isRequired,
    content: PropTypes.array.isRequired,
    slug: PropTypes.string.isRequired,
    is_in_enumeration: PropTypes.bool.isRequired,
  }).isRequired,
  index: PropTypes.number,
  titleSlug: PropTypes.string,
  setContentParent: PropTypes.func,
  contentParent: PropTypes.array,
}
export default Title
