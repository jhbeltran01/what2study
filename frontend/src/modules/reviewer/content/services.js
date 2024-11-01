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
