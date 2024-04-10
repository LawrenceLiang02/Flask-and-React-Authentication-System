import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Signup from './Pages/signup';
import ChangePassword from './Pages/changePassword';
import parameters from './Pages/passwordComplexityForm'
import { PassThrough } from 'stream';
import PasswordComplexityForm from './Pages/passwordComplexityForm';
import Cookies from 'universal-cookie';

function PrivateRoute({ element, ...rest }: any) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const cookies = new Cookies();

  function getCookieValue(cookieName: string): string | undefined {
      return cookies.get(cookieName);
  }

  useEffect(() => {
    async function checkTokenValidity() {
      try {
        const token = getCookieValue('token');

        if (!token) {
          setIsAuthenticated(false);
          return;
        }
		    setIsAuthenticated(true);
        // const response = await fetch('http://localhost:80/validatetoken', {
        //   method: 'POST',
        //   headers: {
        //     'x-access-tokens': token,
        //   },
        // });

        // if (response.ok) {
        //   setIsAuthenticated(true);
        // } else {
        //   setIsAuthenticated(false);
        // }
      } catch (error) {
        console.log('Error validating token:', error);
        setIsAuthenticated(false);
      }
    }

    if (isAuthenticated === null) {
      checkTokenValidity();
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
}

function App() {
  return (
    <>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500;700&display=swap" />
      </head>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/changePassword" element={<PrivateRoute element={<ChangePassword />} />} />
          <Route path="/passwordComplexityForm" element={<PrivateRoute element={<PasswordComplexityForm />} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
