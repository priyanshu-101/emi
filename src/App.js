import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EMIForm from './components/EmiForm';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EMIForm />} />
      </Routes>
    </Router>
  );
}

export default App;
