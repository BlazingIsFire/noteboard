import React from "react";
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Login from './pages/Login';
import Home from './pages/Home';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <>
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />}/>
        {/* PrivateRoutes */}
          <Route element={<PrivateRoute />}>
            <Route path='home' element={<Home/>}/>
          </Route>
      </Routes>
    </AuthProvider>
    </>
  );
}

export default App;
