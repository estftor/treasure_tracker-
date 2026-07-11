import { useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import TreasuresPage from './pages/TreasuresPage'
import Home from './pages/Home'
import SignUpSuccessful from './pages/SignUpSuccessful'
import './App.css'

function App() {
  const [status, setStatus] = useState('')
  const [session, setSession] = useState(null)

  return (
    <div>
      <div>

        {status ? <p className="auth-status">{status}</p> : null}

        <Routes>
          <Route
            path="/"
            element={<SignUpPage onStatus={setStatus} onSession={setSession} />}
          />
          <Route
            path="/signin"
            element={<SignInPage onStatus={setStatus} onSession={setSession} />}
          />
          <Route
            path="/signup"
            element={<SignUpPage onStatus={setStatus} onSession={setSession} />}
          />
          <Route
            path="/home"
            element={<Home onStatus={setStatus} onSession={setSession} />}
          />
          <Route
            path="/treasures"
            element={<TreasuresPage onStatus={setStatus} onSession={setSession} />}
          />
          <Route path="SignUpSuccessful" element={<SignUpSuccessful />} />
        </Routes>
      </div>
    </div>
  )
}

export default App