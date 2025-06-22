import React from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { RegisterPage } from './components/auth/RegisterPage';
import { BrowserRouter, Routes, Route } from "react-router";
import Principal from './components/Pages/Principal';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">

          <BrowserRouter>
            <Routes>
              <Route path="/Register" element={<RegisterPage />} />
              <Route path="/Login" element={<LoginPage />} />
              <Route path="/Principal" element={<Principal />} />
            </Routes>
          </BrowserRouter>

    </div>
  );


}

export default App;