import { Routes } from "react-router-dom";
import pagesData from "./routes";
import React from "react";
import { generatePageRoutes } from './utils';

const Router = () => {
  const pageRoutes = generatePageRoutes(pagesData);
  return <Routes>{pageRoutes}</Routes>;
};

export default Router;
