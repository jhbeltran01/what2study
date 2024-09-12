import React, { useContext } from 'react'
import { StudyPodContext } from '@root/App';

function Main() {
  const selectedStudyPod = useContext(StudyPodContext)
  console.log(selectedStudyPod.state.name)

  return (
    <div>
      <h1>{selectedStudyPod.state.name}</h1>
    </div>
  )
}

export default Main
