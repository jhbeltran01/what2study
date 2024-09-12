import React, { useReducer } from "react";
import Router from "./routes/Router";

export const StudyPodContext = React.createContext()

const initialStudyPodState = {}
const reducer = (state, action) => {
  return {...state, ...action.payload}
}

const App = () => {
  const [selectedStudyPod, dispatch] = useReducer(reducer, initialStudyPodState)

  const studypod = {
    selectedStudyPod: selectedStudyPod,
    dispatch: dispatch
  }

  return (
    <React.Fragment>
      <StudyPodContext.Provider value={studypod}>
        <Router />
      </StudyPodContext.Provider>
    </React.Fragment>
  );
};

export default App;