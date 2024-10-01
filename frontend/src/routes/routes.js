import Home from '@modules/home_page/Home';
import Homepage from "@modules/home_page/Homepage";
import CreateReviewer from '@modules/reviewer/CreateReviewer/CreateReviewer';
import Reviewer from '@modules/reviewer/Reviewer';
import JoinCall from '@modules/study_pod/components/join_call/Main';
import StudyPod from '@modules/study_pod/components/study_pods/Main';
import React from "react";
import EditReviewer from '@modules/reviewer/EditReviewer/EditReviewer';
import ViewReviewer from '@modules/reviewer/ViewReviewer/ViewReviewer';
import Notes from '../modules/notes/Notes';
import CreateNotes from '../modules/notes/CreateNotes/CreateNotes';

// import Auth from "@modules/authentication/Auth";
import * as routes from "./constants";

// const AppRoutes = () => {
//   const [isAuthenticated, setIsAuthenticated] = useState(false); 

//   return isAuthenticated ? (
//     <Homepage />
//   ) : (
//     <Auth onAuthSuccess={() => setIsAuthenticated(true)} />
//   );
// };

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
        path: routes.ROUTES.EDIT_REVIEWER, 
        element: <EditReviewer />,
        title: routes.EDIT_REVIEWER, 
      },
      {
        path: routes.ROUTES.VIEW_REVIEWER, 
        element: <ViewReviewer />,
        title: routes.VIEW_REVIEWER, 
      },
      {
        path: routes.ROUTES.NOTES, 
        element: <Notes />,
        title: routes.NOTES, 
      },
      {
        path: routes.ROUTES.CREATE_NOTES, 
        element: <CreateNotes />,
        title: routes.CREATE_NOTES, 
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
