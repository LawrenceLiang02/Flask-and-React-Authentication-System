import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PasswordComplexityForm  ()  {
  const [minLength, setMinLength] = useState(8);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  /**useEffect(() => {
    
   const fetchPasswordConfig = async () => {
    try {
      const response = await axios.get('http://localhost/getPasswordConfig', {
        headers: {
          'x-access-tokens': token,
        },
      });

      if (response.status === 200) {
        const { minLength, requireLowercase, requireUppercase, requireNumbers, requireSpecialChars } = response.data;
        setMinLength(minLength);
        setRequireLowercase(requireLowercase);
        setRequireUppercase(requireUppercase);
        setRequireNumbers(requireNumbers);
        setRequireSpecialChars(requireSpecialChars);
      } else {
        console.error('Failed to fetch password configuration');
      }
    } catch (error) {
      console.error('Error fetching password configuration:', error);
    }
  };

  fetchPasswordConfig(); 

  }, [token]);*/
  
  const handleSubmit = async (event: React.FormEvent) => {
    
    event.preventDefault();
    
    
    try {
      const response = await axios.post(
        'http://localhost/updatePasswordConfig', 
        {
          "min_length":minLength,
          "require_lowercase":requireLowercase,
          "require_uppercase":requireUppercase,
          "require_numbers":requireNumbers,
          "require_special_chars":requireSpecialChars
      }, 
      {
        headers: {
            'x-access-tokens': token,
        }
      }
    );

      if (response.status === 200) {
        console.log('Password configuration updated successfully');
        console.log(response)
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
      {}
      <div className='h-fit w-full flex flex-row items-center justify-around bg-slate-100 py-40'>
        <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-20 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
          <div className='text-3xl font-semibold tracking-wider'>Gestion de la Complexité du Mot de Passe</div>

          <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
              <label className='text-lg font-semibold'>Longueur minimale du mot de passe:</label>
              <input
                type="number"
                value={minLength}
                onChange={(e) => setMinLength(parseInt(e.target.value))}
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

            <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Valider" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default PasswordComplexityForm;