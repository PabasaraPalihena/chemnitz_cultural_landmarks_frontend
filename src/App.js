import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navbar from "./components/common/Navbar/Navbar";
import Footer from "./components/common/view/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<h1>Welcome</h1>} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
