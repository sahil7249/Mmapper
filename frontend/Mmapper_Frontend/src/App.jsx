import Navbar from "./page-components/Navbar"
import { Main } from "./page-components/Main"
import { Footer } from "./page-components/Footer"
import { MindMapContainer } from "./page-components/MindMapContainer"
import { MapList } from "./page-components/MapList"
import { createContext, useState, useEffect } from "react"
import { Routes, Route } from 'react-router-dom'


export const UIStateContext = createContext(null)

const fetchDBData = async () => {
  try {
    const dbResponse = await fetch('http://localhost:8080/api/all-maps', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!dbResponse.ok) {
      console.log(dbResponse.message)
    }
    const mapData = await dbResponse.json()
    console.log("Map data fetched successfully")
    return mapData
  } catch (error) {
    console.log("Error while fetching map data: ", error)
  }
}


const App = () => {
  const [data, setData] = useState("")
  const [mapData, setMapData] = useState([])

  useEffect(() => {
    const markdown_data = fetchDBData()
    markdown_data.then(response => {
      setMapData(response.data)
    })
  }, [])

  return (
    <>
      <UIStateContext.Provider value={{ data: data, setData: setData }}>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={<Main />}
          />
          <Route
            path="/mindmap"
            element={<MindMapContainer markdown={data} />}
          />
          <Route
            path="/list"
            element={<MapList maps={mapData} />}
          />
        </Routes>
        <Footer />
      </UIStateContext.Provider>
    </>
  )
}

export default App