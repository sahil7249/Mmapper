import Navbar from "./page-components/Navbar"
import { Main } from "./page-components/Main"
import { Footer } from "./page-components/Footer"
import { MindMapContainer } from "./page-components/MindMapContainer"
import { MapList } from "./page-components/MapList"
import { createContext,useState } from "react"

export const UIStateContext = createContext(null)
const App = () => {
  const [state,setState] = useState("default")
  const [data,setData] = useState("")

  const markdown_content = JSON.parse(localStorage.getItem('mindmap'))
  
  return (
    <>
    <UIStateContext.Provider value={{state:state,setState:setState,data:data,setData:setData}}>
      <Navbar />
      {state == "default" && <Main />}
      {state == "mindmap" && <MindMapContainer markdown={data} />}
      {state == "list" && <MapList maps={markdown_content}/>}
      <Footer />
    </UIStateContext.Provider>
    </>
  )
}

export default App