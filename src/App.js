import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Data from './pages/Data';


function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/" exact element={<Home />} /> 
            <Route path="/data" element={<Data />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
