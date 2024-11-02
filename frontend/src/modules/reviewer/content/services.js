import axios from "axios"
import { apiRootURL } from '@root/globals'

const tryCatch = (request) => {
  try {
    const response = request
    console.log('hello')
    return [true, response.data];
  } catch (err) {
    return [false, {}];
  }
}

export const makeTextareaHeightToBeResponsive = (textarea) => {
  textarea.style.height = 'auto';
  textarea.style.height = textarea.scrollHeight + 'px';
}

export const performAddNewDefinition = async (reviewer, title, text) => {
  return tryCatch(
    await axios.post(
      `${apiRootURL}/reviewers/${reviewer}/content/titles/${title}/definition/`,
      {text: text}
    )
  )
};

export const performDeleteDefinition = async (reviewer, title, definition) => {
  return tryCatch(
    await axios.delete(
      `${apiRootURL}/reviewers/${reviewer}/content/titles/`
      + `${title}/definition/${definition}/`
    )
  )
};

export const performAddNewEnumerationTitle = async (reviewer, title, text) => {
  return tryCatch(
    await axios.post(
      `${apiRootURL}/reviewers/${reviewer}/content/titles/${title}/enumeration-titles/`,
      {text: text}
    )
  )
}

export const performDeleteEnumerationTitle = async (reviewer, title, enumTitle, isDefinition) => {
  return tryCatch(
    await axios.delete(
      `${apiRootURL}/reviewers/${reviewer ? reviewer : 'not-needed'}/content/titles/${title ? title : 'not-needed'}/enumeration-titles`
      + `/${enumTitle}/${isDefinition ? 1 : 0}/`,
    )
  )
}