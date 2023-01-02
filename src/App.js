import React from "react";
import Home from './pages/Home';
import Login from './pages/Login';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from "./contexts/AuthContext";

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
