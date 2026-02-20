import { BrowserRouter, Route, Routes } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Campaign from "./pages/Campaign"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<Home/>} />
          <Route path="campaign" element={<Campaign/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
