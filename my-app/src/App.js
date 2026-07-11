import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import TreasuresPage from './pages/TreasuresPage'
import Home from './pages/Home'
import SignUpSuccessful from './pages/SignUpSuccessful'
import './App.css'

function App() {
  const [session, setSession] = useState(null)

  return (
    <div>
      <div>
        <Routes>
          <Route
            path="/"
            element={<SignUpPage onSession={setSession} />}
          />
          <Route
            path="/signin"
            element={<SignInPage onSession={setSession} />}
          />
          <Route
            path="/signup"
            element={<SignUpPage onSession={setSession} />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/treasures"
            element={<TreasuresPage session={session} />}
          />
          <Route path="/signup-successful" element={<SignUpSuccessful />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
