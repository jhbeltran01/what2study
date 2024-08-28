import React, { Component } from 'react'
import { Routes, Route } from 'react-router-dom'
import Page1 from './modules/Page1'
import Page2 from './modules/Page2'

const rootPath = 'app'

export default function App() {
  return (
    <Routes>
      <Route path={rootPath} element={<Page1 />} />
      <Route path={rootPath + '/page2/'} element={<Page2 />} />
    </Routes>
  )
}
