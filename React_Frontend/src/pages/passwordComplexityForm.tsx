import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../Components/navbar';
import { useNavigate } from 'react-router-dom';

function PasswordComplexityForm  ()  {
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(16);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [passwordExpirationTime, setPasswordExpirationTime] = useState(3);
  const [nbTentative, setNbTentative] = useState(3);
  const [nbMdpAncien, setNbMdpAncien] = useState(3);
  const [tentativeIntervale, setTentativeIntervale] = useState(1);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    
   const fetchPasswordConfig = async () => {
    try {
      const response = await axios.get('https://localhost:80/getPasswordConfig', {
        headers: {
          'x-access-tokens': token,
        },
      });

      if (response.status === 200) {
        const data = response.data[0]; // Access the first object in the array
        setMinLength(data.min_length);
        setMaxLength(data.max_length);
        setRequireLowercase(data.require_lowercase);
        setRequireUppercase(data.require_uppercase);
        setRequireNumbers(data.require_numbers);
        setPasswordExpirationTime(data.password_expiration_time);
        setNbTentative(data.nb_tentative);
        setNbMdpAncien(data.nb_mdp_ancien);
        setTentativeIntervale(data.tentative_intervale);

      } else {
        console.error('Failed to fetch password configuration');
      }
    } catch (error) {
      console.error('Error fetching password configuration:', error);
    }
  };

  fetchPasswordConfig(); 

  }, [token]);
  
  const handleSubmit = async (event: React.FormEvent) => {
    
    event.preventDefault();
    
    
    try {
      const response = await axios.post(
        'https://localhost:80/updatePasswordConfig', 
        {
          "min_length":minLength,
          "max_length":maxLength,
          "require_lowercase":requireLowercase,
          "require_uppercase":requireUppercase,
          "require_numbers":requireNumbers,
          "require_special_chars":requireSpecialChars,
          "password_expiration_time":passwordExpirationTime,
          "tentative_intervale":tentativeIntervale,
          "nb_tentative":nbTentative,
          "nb_mdp_ancien":nbMdpAncien
      }, 
      {
        headers: {
            'x-access-tokens': token,
        }
      }
    );

      if (response.status === 200) {
        console.log('Password configuration updated successfully');
        navigate("/dashboard");
        window.location.reload();
      } else {
        console.error('Failed to update password configuration');
      }
    } catch (error) {
      console.error('Error updating password configuration:', error);
    }
  };

  

  return (
    <div className='w-full min-h-screen h-full bg-gray-100 pb-20'>
      <NavBar></NavBar>
      <div className='h-fit w-full flex flex-row items-center justify-around bg-slate-100 py-20'>
        <div className='bg-white flex flex-col items-center justify-between px-20 py-20 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
          <div className='text-4xl font-semibold tracking-wider text-center uppercase'>Gestion des parametres</div>

          <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
            <p className='text-2xl font-semibold underline'>Mot de passe</p>
            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Longueur minimale du mot de passe:</label>
              <input
                type="number"
                value={minLength}
                onChange={(e) => setMinLength(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Longueur Maximale du mot de passe:</label>
              <input
                type="number"
                value={maxLength}
                onChange={(e) => setMaxLength(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
              <label className='text-lg font-semibold'>Inclure des lettres minuscules:</label>
              <input
                type="checkbox"
                checked={requireLowercase}
                onChange={(e) => setRequireLowercase(e.target.checked)}
              />
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
              <label className='text-lg font-semibold'>Inclure des lettres majuscules:</label>
              <input
                type="checkbox"
                checked={requireUppercase}
                onChange={(e) => setRequireUppercase(e.target.checked)}
              />
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
              <label className='text-lg font-semibold'>Inclure des chiffres:</label>
              <input
                type="checkbox"
                checked={requireNumbers}
                onChange={(e) => setRequireNumbers(e.target.checked)}
              />
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
              <label className='text-lg font-semibold'>Inclure des caractères spéciaux:</label>
              <input
                type="checkbox"
                checked={requireSpecialChars}
                onChange={(e) => setRequireSpecialChars(e.target.checked)}
              />
            </div>

            <p className='text-2xl font-semibold underline'>Configuration de connexion</p>

            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Temps (min) avant l'expiration du mot de passe:</label>
              <input
                type="number"
                value={passwordExpirationTime}
                onChange={(e) => setPasswordExpirationTime(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Nombre de tentatives:</label>
              <input
                type="number"
                value={nbTentative}
                onChange={(e) => setNbTentative(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Nombre de mot de passe qui ne peuvent pas etre reutilise:</label>
              <input
                type="number"
                value={nbMdpAncien}
                onChange={(e) => setNbMdpAncien(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Intervale de tentative de login:</label>
              <input
                type="number"
                value={tentativeIntervale}
                onChange={(e) => setTentativeIntervale(parseInt(e.target.value))}
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
              />
            </div>

            <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Valider" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordComplexityForm;