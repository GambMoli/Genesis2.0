import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Home, Biblioteca } from './Modules';
import { Header, Footer} from './Core/Components';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/Biblioteca" element={<Biblioteca />} />
      </Routes>
    </Router>
  );
};

export default App;
