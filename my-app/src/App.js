import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import home from './pages/home';
import dashboard from './pages/dashboard';
import './App.css';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}


