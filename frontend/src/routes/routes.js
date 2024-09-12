// import Home from "@modules/home_page/Home";
import React from "react";
import Homepage from "@modules/home_page/Homepage";
import Home from '@modules/home_page/Home'
import Reviewer from '@modules/reviewer/Reviewer'

const pagesData = [
  {
    path: "/",
    element: <Homepage />,
    title: "home-page",
    nested: [
      {
        path: "/",
        element: <Home />,
        title: "home-screen"
      },
      {
        path: "/reviewers",
        element: <Reviewer />,
        title: "reviewers",
      }
    ]
  },
];

export default pagesData;