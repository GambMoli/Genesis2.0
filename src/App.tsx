import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Login, Home } from './Modules';

import { Header, Footer} from './Core/Components';
import { Espacios } from './Modules/Espacios';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/Espacios" element={<Espacios/>}></Route>
      </Routes>
    </Router>
  );
};

export default App;
