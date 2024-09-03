import React from "react";
import Page1 from "@modules/Page1";
import Page2 from "@modules/Page2";
import Page3 from '@modules/Page3';
import Page4 from '@modules/Page4';
import Page5 from "@modules/Page5";

const pagesData = [
  {
    path: "",
    element: <Page1 />,
    title: "home"
  },
  {
    path: "page2",
    element: <Page2 />,
    title: "page2"
  },
  {
    path: "page3",
    element: <Page3 />,
    title: "page3",
    nested: [
      {
        path: "page4",
        element: <Page4 />,
        title: "page4"
      },
      {
        path: "page5",
        element: <Page5 />,
        title: "page5"
      },
    ]
  }
];

export default pagesData;