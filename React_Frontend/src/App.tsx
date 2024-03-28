import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Pages/login';
import Dashboard from './Pages/dashboard';
import Signup from './Pages/signup';

function PrivateRoute({ element, ...rest }: any) {
	const [isLoading, setIsLoading] = useState(true);
  
	useEffect(() => {
	  async function checkTokenValidity() {
		try {
		  const token = localStorage.getItem('token');

		  if (!token) {
			setIsLoading(false);
			window.location.href = '/login'; // Redirect directly to login page
			return;
		  }
  
		  const response = await fetch('http://localhost:80/validatetoken', {
			method: 'POST',
			headers: {
			  'x-access-token': token,
			},
		  });
  
		  if (response.ok) {
			setIsLoading(false);
		  } else {
			setIsLoading(false);
			window.location.href = '/login'; // Redirect directly to login page
		  }
		} catch (error) {
		  console.error('Error validating token:', error);
		  setIsLoading(false);
		}
	  }
  
	  checkTokenValidity();
	}, []);
  
	if (isLoading) {
	  return null; // Render nothing while loading
	}
  
	return element;
  }


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
