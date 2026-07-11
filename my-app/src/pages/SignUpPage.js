import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function SignUpPage({ onStatus, onSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to create account.');
      }

      onSession(data.user || null);
      onStatus(data.message || 'Account created successfully.');
      setEmail('');
      setPassword('');
    } catch (error) {
      onStatus(error.message);
    } finally {
      setIsLoading(false);
      navigate('/signup-successful'); // Navigate to the sign-up successful page after successful sign-up
    }
  };

  return (
    <div className="auth-shell">
      <div className="auth-card auth-layout">
        <section className="auth-page">
          <div className="auth-header">
            <h2>Sign up</h2>
            <p>Create a new account to get started.</p>
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
                placeholder="Create a password"
                required
              />
            </label>

            <button type="submit" className="submit-button" disabled={isLoading}>
              {isLoading ? 'Please wait...' : 'Sign up'}
            </button>

            <div>Already have an account? <Link to="/signin">Sign in</Link></div>
          </form>
        </section>
      </div>
    </div>
  );
}
