import React from "react";
import Homepage from "@modules/home_page/Homepage";
import Home from '@modules/home_page/Home'
import Reviewer from '@modules/reviewer/Reviewer'
import StudyPod from '@modules/study_pod/components/study_pods/Main'
import JoinCall from '@modules/study_pod/components/join_call/Main'
import * as routes from "./constants";

const pagesData = [
  {
    path: routes.ROUTES.HOME_PAGE,
    element: <Homepage />,
    title: routes.HOME_PAGE,
    nested: [
      {
        path: routes.ROUTES.HOME_SCREEN,
        element: <Home />,
        title: routes.HOME_SCREEN
      },
      {
        path: routes.ROUTES.REVIEWERS,
        element: <Reviewer />,
        title: routes.REVIEWERS,
      },
      {
        path: routes.ROUTES.STUDYPODS,
        element: <StudyPod />,
        title: routes.STUDYPODS,
      },
      {
        path: routes.ROUTES.JOIN_CALL,
        element: <JoinCall />,
        title: routes.JOIN_CALL,
      }
    ]
  },
];

export default pagesData;