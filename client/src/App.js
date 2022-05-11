import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Accions from './Components/Accions/Accions';
import DetalleAccion from './Components/DetalleAccion/DetalleAccion';
import Login from './Components/Login/Login';
import Nav from './Components/Nav/Nav';
import AuthProvider from './Components/providers/AuthProvider/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Nav/>
        <Routes>
          <Route path="/" exact element={<Login />} />
          <Route path="/Accions" exact element={<Accions />} />
          <Route path="/DetalleAccion/:symbol" exact element={<DetalleAccion/>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
