import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EMIForm from './components/EmiForm';
import ResultPage from './components/ResultPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EMIForm />} />
        <Route path="/results" element={<ResultPage />} />
      </Routes>
    </Router>
  );
}

export default App;
