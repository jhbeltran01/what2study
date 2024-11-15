import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { apiRootURL } from '@root/globals'
import * as titleType from './constants'
import StartReviewerIdentification from './StartReviewerIdentification'
import ResetQuestions from './ResetQuestions'
import NoContent from './NoContent'

function Main() {
  const reviewer = useSelector(state => state.reviewer.value)
  const [questions, setQuestions] = useState([])
  const [questionUI, setQuestionUI] = useState(null) 
  const [resetQuestions, setResetQuestions] = useState(false)
  const [hasContent, setHasContent] = useState(true)
  const [messages, setMessages] = useState({})

  useEffect(() => {
    generateQuestions()
  }, [])

  const generateQuestions = () => {
    setResetQuestions(false)

    axios
      .get(`${apiRootURL}/questions/generate/?reviewer=${reviewer.slug}&number_of_questions=10`)
      .then(response => {
        if (response.status == 200) {
          setQuestions(response.data)
          return
        }
        setQuestions([])
        setMessages(response.data)
      })
      .catch(err => {
        setQuestions([])

        if (err.response.status == 400) {
          setMessages(err.response.data)
        }
        console.log(err)
      })
  }

  useEffect(() => {
    if (questions.length < 1 || questions[0] == undefined) { return }

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

  useEffect(() => {
    console.log(messages.must_reset)
    if (!messages.must_reset) { return }
    setResetQuestions(messages.must_reset)
  }, [messages])

  useEffect(() => {
    if (messages.has_content == undefined || messages.has_content) { return }

    setHasContent(messages.has_content)
  }, [messages])

  return (
    <>
      {hasContent}
      {!resetQuestions && hasContent && questionUI}
      {resetQuestions && <ResetQuestions generateQuestions={generateQuestions} />}
      {!hasContent && <NoContent />}
    </>
  )
}

export default Main
