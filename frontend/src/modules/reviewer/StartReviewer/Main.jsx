import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import * as titleType from './constants'
import StartReviewerIdentification from './StartReviewerIdentification'

function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [questions, setQuestions] = useState([])
  const [questionUI, setQuestionUI] = useState(null) 

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    axios
      .get(`${apiRootURL}/questions/generate/?reviewer=${reviewer.slug}&number_of_questions=10`)
      .then(response => {
        setQuestions(response.data)
      })
      .catch(err => {
        console.log(err)
      })
  }

  useEffect(() => {
    if (questions.length < 1) { return }

    switch (questions[0].category) {
      case titleType.IDENTIFICATION:
        setQuestionUI(
          <StartReviewerIdentification 
            questions={questions} 
            generateQuestions={generateQuestions}
            key={1} 
          />
        )
        break
    }
  }, [questions])

  return (
    <div>{questionUI}</div>
  )
}

export default Main
