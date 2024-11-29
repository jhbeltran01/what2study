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

function Title({title, index=null, titleSlug=null}) {
  const isEnumerationTitle = title.content.length === 0 && title.is_in_enumeration
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

  useEffect(() => {
    if (!enumTitle.isUpdated || title.slug != enumTitle.slug) { return }
    setInputText(enumTitle.text)
  }, [enumTitle])

  const updateTitle = (slug, isInEnumerationContent=false, titleSlug='') => {
    if (inputText == text || inputText == '') { 
      setInputText(text)
      return 
    }

    axios
      .patch(
        `${apiRootURL}/reviewers/${reviewer.reviewer}/content/titles/${title.slug}/`,
        {text: inputText}
      )
      .then(response => {
        const text = response.data.text
        if (isInEnumerationContent) {
          updateUIOnUpdateEnumerationTitle(text, slug, titleSlug)
        } else {
          updateUIOnUpdateTitle(text, slug)
        }
        setText(text)
      })
      .catch(err => {
        console.log(err)
      })
  }

  const updateUIOnUpdateTitle = (text, slug) => {
    setTitles(titles.map(title => title.slug == slug ? {...title, text: text} : title))
  }

  const updateUIOnUpdateEnumerationTitle = (text, slug, titleSlug) => {
    const tempTitles = titles.map(title => {
      if (title.slug == slug) {
        return {...title, text:text}
      }

      if (title.slug != titleSlug) { return title }

      const tempTitle = {...title}

      tempTitle.content = tempTitle.content.map(
        content => content.slug == slug ? {...content, text:text} : content
      )

      return tempTitle
    })

    setTitles(tempTitles)
    setEnumTitle({isUpdated: true, slug: slug, text: text})
  }

  const addAContent = async (slug) => {
    let addingIsSuccessful = false

    if (isDefinitionTitle || isEnumerationTitle || isEnumerationTitleWithDefinition) {
      addingIsSuccessful = await addDefinition(slug)
    }

    if (isEnumeration) {
      addingIsSuccessful = await addEnumerationTitle(slug)
    }

    if (!addingIsSuccessful) { return }

    setWillAddAContent(false)
    setNewContentValue('')
  }

  const addDefinition = async (slug) => {
    const [isSuccessful, newDefinition] = await performAddNewDefinition(
      reviewer.reviewer, 
      title.slug, 
      newContentValue
    )
    updateUIOnAddContent(slug, newDefinition)
    return isSuccessful
  }

  const addEnumerationTitle = async (slug) => {
    const [isSuccessful, newEnumTitle] = await performAddNewEnumerationTitle(
      reviewer.reviewer, 
      title.slug, 
      newContentValue
    )

    updateUIOnAddContent(slug, newEnumTitle)
    return isSuccessful
  }

  const updateUIOnAddContent = (titleSlug, newContent) => {
    const tempTitles = titles.map(title => {
      if (title.slug != titleSlug) { return title }

      const newTitle = {...title}
      newTitle.content = [...newTitle.content, newContent]

      return newTitle
    })

    setTitles(tempTitles)
  }

  const handleNewContentChange = (event) => {
    setNewContentValue(event.target.value)
    makeTextareaHeightToBeResponsive(event.target)
  }

  const deleteAnEnumTitle = async () => {
    const [isSuccessful] = await performDeleteEnumerationTitle(
      reviewer.reviewer,
      titleSlug,
      title.slug,
      isEnumerationTitleWithDefinition,
    )
    if (!isSuccessful) { return }

    if (isEnumerationTitleWithDefinition) {
      updateUIOnDeleteTitle(title.slug)
    } else {
      updateUIOnEnumTitleDelete(titleSlug, title.slug)
    }
  }

  const deleteATitle = async () => {
    const [isSuccessful] = await performDeleteTitle(
      reviewer.reviewer,
      title.slug
    )

    if (!isSuccessful) { return }

    updateUIOnDeleteTitle(title.slug)
  }

  const updateUIOnEnumTitleDelete = (titleSlug, slug) => {
    const tempTitles = titles.map(title => {
      if (title.slug != titleSlug) { return title }

      const tempTitle = {...title}
      tempTitle.content = title.content.filter(content => content.slug != slug)
      return tempTitle
    })

    setTitles(tempTitles)
  }

  const updateUIOnDeleteTitle = (slug) => {
    setTitles(titles.filter(title => title.slug != slug))
  }

  const deleteTitleFunction = (isEnumerationTitle || isEnumerationTitleWithDefinition) 
    ? deleteAnEnumTitle
    : deleteATitle

    return (
      <ContentContext.Provider value={[content]}>
        <li className={`${!isEnumerationTitle && 'm-[1rem]'}`}>
          <div className='flex title-gap'>
            <input
              className='title-input'
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onBlur={() => updateTitle(title.slug, isEnumerationTitle, titleSlug)}
            />
            <div className='title-buttons'>
              <button className='add-button' onClick={() => setWillAddAContent(true) }>+</button>
              <button className='delete-button' onClick={() => deleteTitleFunction(index)}>-</button>
              {isEnumeration && <button>Order</button>}
            </div>
          </div>
          <ul className='title-info'>
            {title.content.map((data, index) => {
              switch(title.t_type) {
                case constants.DEFINITION:
                case constants.ENUMERATION_TITLE:
                  return <Definition
                            definition={data}
                            titleSlug={title.slug}
                            deleteAContent={() => {}}
                            index={index}
                            key={data.slug}
                          />
                case constants.ENUMERATION:
                  return <Title
                            title={data}
                            index={index}
                            titleSlug={title.slug}
                            setContentParent={setContent}
                            contentParent={content}
                            key={data.slug}
                          />
              }
            })}
            <li style={{ display: willAddAContent ? 'block' : 'none' }}>
              {
                willAddAContent && !isEnumeration
                && <textarea
                  className='new-definition-textarea w-[100%] text-red-700'
                  value={newContentValue}
                  onChange={handleNewContentChange}
                  onBlur={() => addAContent(title.slug)}
                ></textarea>
              }
              {
                willAddAContent && isEnumeration
                && <input
                  className='w-[100%] text-red-700'
                  value={newContentValue}
                  onChange={handleNewContentChange}
                  onBlur={() => addAContent(title.slug)}
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