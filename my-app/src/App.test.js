import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the auth screen with sign in and sign up controls', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: /authentication/i })).toBeInTheDocument();
  expect(screen.getAllByRole('button', { name: /sign in/i }).length).toBeGreaterThan(0);
  expect(screen.getAllByRole('button', { name: /sign up/i }).length).toBeGreaterThan(0);
});
