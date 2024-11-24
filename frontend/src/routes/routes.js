import Home from '@modules/home_page/Home';
import Homepage from "@modules/home_page/Homepage";
import CreateReviewer from '@modules/reviewer/CreateReviewer/CreateReviewer';
import Reviewer from '@modules/reviewer/Reviewer';
import JoinCall from '@modules/study_pod/components/join_call/Main';
import StudyPod from '@modules/study_pod/components/study_pods/Main';
import ReviewerContent from '@modules/reviewer/content/Main'
import ReviewerContentNoEdit from '@modules/reviewer/view_content/Main'
import Notes from '@modules/notes/Main'
import NoteContent from '@modules/notes/notes-tab/content/Main'
import TodosContent from '@modules/notes/todos-tab/content/Main'
import Settings from '@modules/settings/Main'
import CreateStudypod from '@modules/study_pod/components/study_pods/create_form/Main'
import Subjects from '@modules/subjects/Main'
import SubjectContent from '@modules/subjects/content/Main'
import CreateSubjectReviewer from '@modules/subjects/create_reviewer/Main'
import StartReviewing from '@modules/reviewer/StartReviewer/Main.jsx'
import React from "react";
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
        path: routes.ROUTES.CREATE_REVIEWER, 
        element: <CreateReviewer />,
        title: routes.CREATE_REVIEWER, 
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
      },
      {
        path: routes.ROUTES.VIEW_REVIEWER_CONTENT,
        element:  <ReviewerContent />,
        title: routes.VIEW_REVIEWER_CONTENT
      },
      {
        path: routes.ROUTES.VIEW_CONTENT_WITHOUT_EDIT,
        element:  <ReviewerContentNoEdit />,
        title: routes.VIEW_REVIEWER_CONTENT
      },
      {
        path: routes.ROUTES.NOTES,
        element:  <Notes />,
        title: routes.NOTES,
      },
      {
        path: routes.ROUTES.NOTE_CONTENT,
        element:  <NoteContent />,
        title: routes.NOTE_CONTENT,
      },
      {
        path: routes.ROUTES.TODOS_CONTENT,
        element:  <TodosContent />,
        title: routes.TODOS_CONTENT,
      },
      {
        path: routes.ROUTES.SETTINGS,
        element:  <Settings />,
        title: routes.SETTINGS,
      },
      {
        path: routes.ROUTES.STUDYPOD_CREATE,
        element:  <CreateStudypod />,
        title: routes.STUDYPOD_CREATE,
      },
      {
        path: routes.ROUTES.SUBJECTS,
        element:  <Subjects />,
        title: routes.SUBJECTS,
      },
      {
        path: routes.ROUTES.SUBJECT_CONTENT,
        element:  <SubjectContent />,
        title: routes.SUBJECT_CONTENT,
      },
      {
        path: routes.ROUTES.SUBJECT_CREATE_REVIEWER,
        element:  <CreateSubjectReviewer />,
        title: routes.SUBJECT_CREATE_REVIEWER,
      },
      {
        path: routes.ROUTES.SUBJECT_NOTE,
        element:  <NoteContent />,
        title: routes.SUBJECT_NOTE,
      },
      {
        path: routes.ROUTES.SUBJECT_REVIEWER,
        element:  <ReviewerContent />,
        title: routes.SUBJECT_REVIEWER
      },
      {
        path: routes.ROUTES.START_REVIEWING,
        element:  <StartReviewing />,
        title: routes.START_REVIEWING
      },
    ]
  },
];

export default pagesData;
