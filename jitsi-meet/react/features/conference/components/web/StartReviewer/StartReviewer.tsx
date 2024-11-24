import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from './Main'
import { actions, questionType } from './constants'
import StartReviewerIdentification from './StartReviewerIdentification'
import StartReviewerMultipleChoice from './StartReviewerMultipleChoice'

interface MyComponentProps {
  questions: any[];
}


const StartReviewer:  React.FC<MyComponentProps> = ({questions}) => {
  const socket = useContext(SocketContext)

  useEffect(() => {
    if (questions.length > 0) { return }

    const message = JSON.stringify({
      action: actions.GENERATE_QUESTION,
      number_of_questions: 1
    })
    socket?.send(message)
  }, [])
  
  if (questions == undefined || questions.length == 0) {
    return <h1>Generating a question</h1>
  }

  const question = questions[0]

  switch(question.category) {
    case questionType.IDENTIFICATION:
      return <StartReviewerIdentification  question={question}/>
    case questionType.MULTIPLE_CHOICE:
      return <StartReviewerMultipleChoice question={question} />
    default:
      return <h1>Invalid</h1>
  }
}

export default StartReviewer
