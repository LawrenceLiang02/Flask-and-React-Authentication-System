import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [user_role, setUserRole] = useState('');
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const capitalLetterRegex = /[A-Z]/;
        const numberRegex = /\d/;
        const specialCharacterRegex = /[$%#@!&]/;
        const validLength = password.length >= 8 && password.length <= 16;
        const lowercaseLetterRegex = /[a-z]/;

        if (!lowercaseLetterRegex.test(password)) {
          setErrorMessage('Password must contain at least one lowercase letter.');
          return;
        }

        if (!capitalLetterRegex.test(password)) {
          setErrorMessage('Password must contain at least one capital letter.');
          return;
        }
    
        if (!numberRegex.test(password)) {
          setErrorMessage('Password must contain at least one number.');
          return;
        }
    
        if (!specialCharacterRegex.test(password)) {
          setErrorMessage('Password must contain at least one special character ($%#@!&).');
          return;
        }
    
        if (!validLength) {
          setErrorMessage('Password must be between 8 to 16 characters in length.');
          return;
        }
        
        try {
            const response = await axios.post(
                'http://localhost/signup',
                {
                    username: username,
                    password: password,
                    user_role: user_role
                }
            );

            if (response.status === 200) {
                console.log('Signup successful');
                navigate('/login');
            } else {
                alert('Signup failed');
                console.log("Failed")
            }
        } catch (error:any) {
            console.error('Error during signup:', error);
            setErrorMessage('Error during signup: ' + error.response.data.error);
        }
    };
  
    return (
      <div className='min-h-screen h-full w-full flex flex-row items-center justify-around bg-slate-100'>
        <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-10 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
          <div className='text-3xl font-semibold tracking-wider'>SIGN UP - ÉQUIPE M</div>

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
              <input
                type="password"
                id="password"
                className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className='flex flex-row items-center justify-between w-full h-full'>
              <p className='text-lg font-semibold w-2/5'>Type de client:</p>
              <div className='flex flex-row items-start justify-between w-3/5 h-full'>
                <div className='text-lg flex flex-row items-center justify-around space-x-2'>
                  <input type="radio" value="CLIENT_AFFAIRE" name="client" onChange={(e) => setUserRole("CLIENT_AFFAIRE") }/>
                  <p>Affaire</p>
                </div>
                
                <div className='text-lg flex flex-row items-center justify-around space-x-2'>
                  <input type="radio" value="CLIENT_RESIDENTIEL" name="client" onChange={(e) => setUserRole("CLIENT_RESIDENTIEL") }/>
                  <p>Residentiel</p>
                </div>
              </div>
              
              
            </div>
            
            <div className='w-full flex flex-col justfiy-start'>
              <a className="text-blue-500 hover:underline ease-in-out duration-200 transition-all" href="/login">Retourner à la page de connexion</a>
            </div>

            <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Créer mon compte" />
          </form>
        </div>
      </div>
    );
  }

export default Signup