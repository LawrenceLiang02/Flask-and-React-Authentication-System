import React, { useState } from 'react'
import NavBar from '../Components/navbar';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import Cookies from 'universal-cookie';

function ChangePasswordAsAdmin({username}:any) {
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    document.body.classList.add("overflow-y-hidden")

    const cookies = new Cookies();

    function getCookieValue(cookieName: string): string | undefined {
        return cookies.get(cookieName);
    }

    const token = getCookieValue('token');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
        const response = await axios.post(
            'https://localhost:80/updatePasswordAsAdmin',
            {
                "username":username,
                "newPassword":newPassword
            },
            {
            headers: {
                'x-access-tokens': token,
            }
            }
        );

        if (response.status === 200) {
            navigate("/dashboard");
            window.location.reload();
        } else {
            alert('Update failed');
            console.log("Update Failed")
        }
        } catch (error:any) {
        setErrorMessage('Error: ' + error.response.data.error);
        console.error('Error during update password:', error);
        }
    };
    
    function closePopup() {
        navigate("/dashboard");
        window.location.reload();
    }

  return (
    <div className='absolute z-20 top-0 left-0 h-full w-full flex flex-row items-center justify-around bg-black bg-opacity-30'>
        <div className='flex flex-row items-start justify-around overscroll-none space-x-2'>
            <button className=" bg-red-500 rounded-full p-1 hover:scale-[105%] hover:shadow-2xl ease-in-out duration-200 transition-all" onClick={closePopup}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="white" className="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
            </button>
            <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-20 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
                <div className='text-3xl font-semibold tracking-wider'>CHANGER LE MOT DE PASSE</div>

                <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
                {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                <div className='flex flex-row items-start justify-between w-full'>
                    <p className='font-semibold text-lg '>Utilisateur: </p>
                    <p className='w-1/2 text-left'>{username}</p>
                </div>
                <div className='flex flex-row items-start w-full justify-between'>
                <p className='text-lg font-semibold'>Nouveau mot de passe: </p>
                    <div className='flex flex-col items-start w-1/2'>
                        <input
                            type={
                            showPassword ? "text" : "password"
                            }
                            id="password"
                            className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

                
                <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Changer le mot de passe" />
                </form>
            </div>
        </div>
    </div>
    
  )
}

export default ChangePasswordAsAdmin