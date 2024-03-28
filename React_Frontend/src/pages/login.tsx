import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const basicAuth = btoa(`${username}:${password}`);

      const response = await axios.post(
        'http://localhost/login',
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuth}`
          }
        }
      );

      if (response.status === 200) {
        console.log('Login successful');
        const token = response.data.token;
        localStorage.setItem('token', token);
        navigate('/dashboard');
      } else {
        alert('Login failed');
        console.log("Failed")
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className='min-h-screen h-full w-full flex flex-row items-center justify-around bg-slate-100'>
      <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-10 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
        <div className='text-3xl font-semibold tracking-wider'>LOGIN - ÉQUIPE M</div>

        <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
          <div className='flex flex-row items-start justify-between space-x-2 w-full'>
            <p className='text-lg font-semibold'>Nom d'utilisateur: </p>
            <input
              type="text"
              id="username"
              className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className='flex flex-row items-start justify-between w-full'>
            <p className='text-lg font-semibold'>Mot de passe: </p>
            <input
              type="password"
              id="password"
              className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className='w-full flex flex-col justfiy-start'>
            <a className="text-blue-400 hover:underline ease-in-out duration-200 transition-all" href="/signup">Créer un compte</a>
            <a className="text-blue-400 hover:underline ease-in-out duration-200 transition-all" href="/forgotpassword">Mot de passe oublié</a>
          </div>
          
          <input className='bg-orange-500 text-white py-2 px-8 rounded-lg hover:bg-orange-600 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Se Connecter" />
        </form>
      </div>
    </div>
  );
}

export default Login;
