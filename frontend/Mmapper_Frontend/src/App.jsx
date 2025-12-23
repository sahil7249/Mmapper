import Navbar from "./page-components/Navbar"
import { Main } from "./page-components/Main"
import { Footer } from "./page-components/Footer"
import { MindMapContainer } from "./page-components/MindMapContainer"
const App = () => {
  return (
    <>
      <Navbar />
      <Main /> 
      {/* <MindMapContainer /> */}
      <Footer /> 
    </>
  )
}

export default App