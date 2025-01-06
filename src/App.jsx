import './App.css'
import Hangman from './components/Hangman'
import ErrorBoundary from './components/ErrorBoundary'


function App() {
  return (
    <div className="app">
      <h1>Hangman Game</h1>
      <ErrorBoundary>
        <Hangman />
        
      </ErrorBoundary>
    </div>
  )
}

export default App
