import React from "react";
import { Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
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
            <Route path='home' element={<Dashboard/>}/>
          </Route>
      </Routes>
    </AuthProvider>
    </>
  );
}

export default App;
