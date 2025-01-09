import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Hangman from './components/Hangman';
import Home from './components/Home';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [difficulty, setDifficulty] = useState('Easy');
  useEffect(()=>{
    console.log(difficulty)
  })

  return (
    <Router>
      <div className="app">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home setDifficulty={setDifficulty} />} />
            <Route path="/hangman" element={<Hangman difficulty={difficulty} />} />
          </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
}

export default App;
