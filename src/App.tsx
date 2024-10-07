import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Login, Home } from './Modules';
import { Header, Footer } from './Core/Components';
import { EspaciosStudent, EspaciosAdmin } from './Modules/Espacios';
import { Biblioteca } from './Modules';
import { Excusas } from './Modules';
import { ExcusasAdmin } from './Modules';
import { Pasantias } from './Modules';

const App: React.FC = () => {


  const getUserRoleFromLocalStorage = (): string | null => {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user = JSON.parse(userString);
      return user.role;
    }
    return null;
  };

  useEffect(() => {
    const checkUserRole = () => {
      const role = getUserRoleFromLocalStorage();
      return role;
    };


    checkUserRole();


    const intervalId = setInterval(checkUserRole, 1000);


    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        checkUserRole();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const EspaciosRoute = () => {
    const currentRole = getUserRoleFromLocalStorage();
    if (currentRole === "Administrativo") {
      return <EspaciosAdmin />;
    } else if (currentRole) {
      return <EspaciosStudent />;
    } else {
      return <Navigate to="/" />;
    }
  };

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/Biblioteca" element={<Biblioteca />} />
        <Route path="/Espacios" element={<EspaciosRoute />} />
        <Route path="/Excusas" element={<Excusas />} />
        <Route path="/ExcusasAdmin" element={<ExcusasAdmin />} />
        <Route path="/Pasantias" element={<Pasantias />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;