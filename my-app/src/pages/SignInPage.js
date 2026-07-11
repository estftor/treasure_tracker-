import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignInPage({ onStatus, onSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

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
      onStatus(data.message || 'Signed in successfully.');
      setEmail('');
      setPassword('');
    } catch (error) {
      onStatus(error.message);
    } finally {
      setIsLoading(false);
      navigate('/home'); // Navigate to the home page after successful sign-in
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-layout">
        <section className="auth-page">
          <div className="auth-header">
            <h2>Sign in</h2>
            <p>Access your Treasure Tracker account.</p>
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
              {isLoading ? 'Please wait...' : 'Sign in'}
            </button>

            <div>Don't have an account? <Link to="/signup">Sign up</Link></div>
          </form>
        </section>
      </div>
    </div>
  );
}
