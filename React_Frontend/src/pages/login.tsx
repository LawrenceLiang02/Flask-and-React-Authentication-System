import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import Cookies from 'universal-cookie';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const https = require('https');

  const agent = new https.Agent({
    rejectUnauthorized: false,
    requestCert: false,
    agent: false,
  });

  const client = axios.create({
    baseURL: 'https://localhost:80',
    responseType: 'json',
    httpsAgent: agent
});

const cookies = new Cookies();

function setCookie(key:string, value: string) {
  cookies.set(key, value, { path: '/' });
}


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const basicAuth = btoa(`${username}:${password}`);

      const response = await axios.post(
        'https://localhost:80/login',
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuth}`
          },
          
        },
      );

      if (response.status === 200) {
        console.log('Login successful');
        const token = response.data.token;
        const username = response.data.username;
        const user_role = response.data.user_role;
        setCookie('token', token);
        setCookie('user_role', user_role);
        setCookie('username', username);
        navigate('/dashboard');
      }
      else {
        alert('Login failed');
        console.log("Login Failed")
      }
    } catch (error:any) {
      console.log(error.response.status)
      if (error.response.status == 403) {
        const username = error.response.data.username;
        const token = error.response.data.token;
        setCookie('token', token);
        setCookie('user_role', "TEMPORAIRE");
        setCookie('username', username);
        navigate('/changePassword');
      }
      else {
        setErrorMessage('Error: ' + error.response.data.error);
        console.error('Error during login:', error);
      }
    }
  };

  return (
    <div className='min-h-screen h-full w-full flex flex-row items-center justify-around bg-slate-100'>
      <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-10 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
        <div className='text-3xl font-semibold tracking-wider'>LOGIN - ÉQUIPE M</div>

        <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
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
            <div className='flex flex-col items-start space-y-2 justify-around'>
              <input
                type={
                  showPassword ? "text" : "password"
                }
                id="password"
                className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className='flex flex-row justify-between space-x-2 hover:cursor-pointer' onClick={() => setShowPassword(!showPassword)}>
                <input
                  type="checkbox"
                  id="showPasswordCheckbox"
                  className="hover:cursor-pointer"
                  checked={showPassword}
                />
                <p className='text-md text-slate-700'>Show Password</p>
              </div>
              
            </div>

              
          </div>

          <div className='w-full flex flex-col justfiy-start'>
            <a className="text-blue-500 hover:underline ease-in-out duration-200 transition-all" href="/signup">Créer un compte</a>
            {/* <a className="text-blue-500 hover:underline ease-in-out duration-200 transition-all" href="/forgotpassword">Mot de passe oublié</a> */}
          </div>
          
          <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Se Connecter" />
        </form>
      </div>
    </div>
  );
}

export default Login;
