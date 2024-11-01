import axios from "axios"
import { apiRootURL } from '@root/globals'

export const performAddNewDefinition = async (reviewer, title, text) => {
  try {
    const response = await axios.post(
      `${apiRootURL}/reviewers/${reviewer}/content/titles/${title}/definition/`,
      { text: text }
    );
    return [true, response.data];
  } catch (err) {
    return [false, {}];
  }
};

export const performDeleteDefinition = async (reviewer, title, definition) => {
  try {
    const response = await axios.delete(
      `${apiRootURL}/reviewers/${reviewer}/content/titles/`
      + `${title}/definition/${definition}/`,
    );
    return true;
  } catch (err) {
    return true;
  }
};

export const makeTextareaHeightToBeResponsive = (textarea) => {
  textarea.style.height = 'auto'; // Reset height to auto to calculate new height
  textarea.style.height = textarea.scrollHeight + 'px';
}