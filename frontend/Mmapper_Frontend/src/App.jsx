import Navbar from "./page-components/Navbar"
import { Main } from "./page-components/Main"
import { Footer } from "./page-components/Footer"
import { MindMapContainer } from "./page-components/MindMapContainer"
import { MapList } from "./page-components/MapList"
import { createContext, useState, useEffect } from "react"

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
  const [state, setState] = useState("default")
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
      <UIStateContext.Provider value={{ state: state, setState: setState, data: data, setData: setData }}>
        <Navbar />
        {state == "default" && <Main />}
        {state == "mindmap" && <MindMapContainer markdown={data} />}
        {state == "list" && <MapList maps={mapData} />}
        <Footer />
      </UIStateContext.Provider>
    </>
  )
}

export default App