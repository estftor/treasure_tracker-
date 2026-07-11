import { useState } from 'react';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('signin');
  const [status, setStatus] = useState('');
  const [session, setSession] = useState(null);

  return (
    <div className="auth-shell">
      <div className="auth-card auth-layout">
        <div className="auth-header">
          <span className="auth-badge">Treasure Tracker</span>
          <h1>Authentication</h1>
          <p>Choose a page below to sign in or create your account.</p>
        </div>

        <div className="mode-switch" aria-label="Authentication navigation">
          <button
            type="button"
            className={currentPage === 'signin' ? 'active' : ''}
            onClick={() => setCurrentPage('signin')}
          >
            Sign in
          </button>
          <button
            type="button"
            className={currentPage === 'signup' ? 'active' : ''}
            onClick={() => setCurrentPage('signup')}
          >
            Sign up
          </button>
        </div>

        {currentPage === 'signin' ? (
          <SignInPage onStatus={setStatus} onSession={setSession} />
        ) : (
          <SignUpPage onStatus={setStatus} onSession={setSession} />
        )}

        {status ? <p className="auth-status">{status}</p> : null}

        {session ? (
          <div className="session-preview">
            <strong>Signed in user:</strong>
            <code>{session.user?.email || 'Unknown user'}</code>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
