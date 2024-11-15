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
    const {questionIndex, answerIndex, text} = action.payload
    
    let userAnswers = state.value.answers[questionIndex].user_answers
    userAnswers = userAnswers.filter((_, index) => index != answerIndex)
    userAnswers = [
      ...userAnswers.splice(0, answerIndex),
      {'answer': text},
      ...userAnswers.splice(answerIndex)
    ]
    state.value.answers[questionIndex].user_answers = userAnswers
  },
  setCheckedAnswers: (state, action) => {
    state.value = action.payload
  }
}