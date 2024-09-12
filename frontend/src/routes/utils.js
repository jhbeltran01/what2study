import React from "react";
import { Route } from "react-router-dom";

export const generatePageRoutes = (pagesData) => {
  return pagesData.map(({ path, title, element, nested }) => {
    if (nested) {
      const nestedRoutes = generatePageRoutes(nested);
      
      return(
        <Route key={title} path={path} element={element}>
          {nestedRoutes}
        </Route>
      );
    }

    return <Route key={title} path={path} element={element} />;
  })
}