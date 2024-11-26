import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./components/Home.tsx"
import Page from "./components/Page.tsx"
import CreateCard from "./components/CreateCard.tsx"

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/page/:id" element={<Page />} />
        <Route path="/create" element={<CreateCard />} />
      </Routes>
    </Router>
  )
}

export default App
