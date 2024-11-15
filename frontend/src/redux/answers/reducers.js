export default {
  setAnswers: (state, action) => {
    const tempAnswers = {}
    const questions = action.payload.questions
    
    tempAnswers['answers'] = questions.map(question => ({
      correct_answers: question.answer ? [question.answer] : question.answers,
      user_answers: [],
      slug: question.slug,
      is_in_order: question.is_in_order == true
    }))
    tempAnswers['question_type'] = questions[0].category[0]
    tempAnswers['reviewer_slug'] = action.payload.reviewerSlug

    state.value = tempAnswers
  },
  addUserAnswer: (state, action) => {
    const {questionIndex, answerIndex, text, correctAnswer} = action.payload
    
    const isCorrect = correctAnswer == text
    
    const obj = state.value.answers[questionIndex]
    obj['is_correct'] = isCorrect
    
    const answer = {
      answer: text,
      is_correct: correctAnswer == text
    }

    let userAnswers = obj.user_answers

    if (userAnswers[answerIndex] == undefined) {
      state.value.answers[questionIndex].user_answers.push(answer)
      return
    }

    state.value.answers[questionIndex].user_answers[answerIndex] = answer
  },
  setCheckedAnswers: (state, action) => {
    state.value = action.payload
  },
  removeLastAnswer: (state, action) => {
    const { questionIndex } = action.payload
    state.value.answers[questionIndex].user_answers.pop()
  },
  pushAnItem: (state, action) => {
    const { questionIndex } = action.payload
    state.value.answers[questionIndex].user_answers.push({answer: ''})
  },
}