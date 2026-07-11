import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInPage({ onSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to sign in.');
      }

      onSession(data.session || null);
      setEmail('');
      setPassword('');
      navigate('/home');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-layout">
        <section className="auth-page">
          <div className="auth-header">
            <span className="auth-emblem" aria-hidden="true">⚓</span>
            <p className="auth-kicker">Treasure Tracker</p>
            <h2>Welcome aboard</h2>
            <p>Sign in to continue your next treasure hunt.</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="name@example.com"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
              />
            </label>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Opening the map...' : 'Set sail'}
            </button>

            {error ? <p className="auth-feedback" role="alert">{error}</p> : null}

            <p className="auth-switch">New to the crew? <Link to="/signup">Create an account</Link></p>
          </form>
        </section>
      </div>
    </div>
  );
}
