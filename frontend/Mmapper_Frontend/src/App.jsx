import Navbar from "./page-components/Navbar"
import { Main } from "./page-components/Main"
import { Footer } from "./page-components/Footer"
import { MindMapContainer } from "./page-components/MindMapContainer"
import { MapList } from "./page-components/MapList"
import { CreateMap } from "./page-components/CreateMap"
import { UpdateMap } from "./page-components/UpdateMap"
import { createContext, useState, useEffect } from "react"
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

export const UIStateContext = createContext(null)

const App = () => {

  return (
    <>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/mindmap/:id"
            element={<MindMapContainer />}
          />
          <Route
            path="/list"
            element={<MapList />}
          />
          <Route
            path="/create"
            element={<CreateMap />}
          />
          <Route
            path="/update/:id"
            element={<UpdateMap />}
          />
        </Routes>
        <ToastContainer />
        <Footer />
    </>
  )
}

export default App