import Home from "@modules/home_page/Home";
import React from "react";
import Homepage from "../modules/home_page/Homepage";

const pagesData = [
  {
    path: "/",
    element: <Homepage />,
    title: "home-page",
    nested: [
    ]
  },
  {
    path: `/reviewer`,
    element: <Home />,
    title: "home-page",
    nested: [
    ]
  },
  {
    path: "/reviewers/create-reviewer/review",
    element: <Home />,
    title: "home-page",
    nested: [
    ]
  },
  // {
  //   path: "page3",
  //   element: <Page3 />,
  //   title: "page3",
  //   nested: [
  //     {
  //       path: "page4",
  //       element: <Page4 />,
  //       title: "page4"
  //     },
  //     {
  //       path: "page5",
  //       element: <Page5 />,
  //       title: "page5"
  //     },
  //   ]
  // }
];

export default pagesData;