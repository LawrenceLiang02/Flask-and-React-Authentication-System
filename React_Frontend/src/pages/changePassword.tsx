import React, { useState } from 'react'
import NavBar from '../Components/navbar';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';
import Cookies from 'universal-cookie';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const navigate = useNavigate();

    const cookies = new Cookies();

    function getCookieValue(cookieName: string): string | undefined {
        return cookies.get(cookieName);
    }

    function removeCookie(cookieName: string) {
        cookies.remove(cookieName, { path: '/' });
    }

    const token = getCookieValue('token');
    const role = getCookieValue('user_role')

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
        const response = await axios.post(
            'https://localhost:80/updatePassword',
            {
                "oldPassword":oldPassword,
                "newPassword":newPassword
            },
            {
            headers: {
                'x-access-tokens': token,
            }
            }
        );

        if (response.status === 200) {
            console.log("Password updated")
            removeCookie('token');
            removeCookie('username');
            removeCookie('user_role');
            navigate("/login");
        } else {
            alert('Update failed');
            console.log("Update Failed")
        }
        } catch (error:any) {
        setErrorMessage('Error: ' + error.response.data.error);
        console.error('Error during update password:', error);
        }
    };

  return (
    <div className='w-full min-h-screen h-full bg-gray-100 pb-20'>
        <NavBar></NavBar>

            <div className='h-fit w-full flex flex-row items-center justify-around bg-slate-100 py-40'>
        <div className='z-10 bg-white flex flex-col items-start justify-between px-20 py-20 shadow-lg rounded-2xl hover:shadow-2xl space-y-8 ease-in-out duration-500 transition-all '>
            <div className='text-3xl font-semibold tracking-wider'>CHANGER LE MOT DE PASSE</div>

            <form onSubmit={handleSubmit} className='space-y-4 flex flex-col items-center justify-between w-full'>
            {role === "TEMPORAIRE" && <div className="text-red-600">Mot de passe expiré.</div>}
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
                <p className='text-lg font-semibold'>Ancien mot de passe: </p>
                <div className='flex flex-col'>
                    <input
                        type={
                        showOldPassword ? "text" : "password"
                        }
                        id="password"
                        className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                    />

                    <div className='flex flex-row space-x-2 hover:cursor-pointer' onClick={() => setShowOldPassword(!showOldPassword)}>
                        <input
                        type="checkbox"
                        id="showPasswordCheckbox"
                        className="hover:cursor-pointer"
                        checked={showOldPassword}
                        />
                        <p className='text-md text-slate-700'>Show Password</p>
                    </div>
                </div>
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
                <p className='text-lg font-semibold'>Nouveau mot de passe: </p>
                <div className='flex flex-col'>
                    <input
                    type={
                    showNewPassword ? "text" : "password"
                    }
                    id="password"
                    className='bg-gray-50 border border-gray-300 rounded-lg p-1 hover:border-gray-800 ease-in-out duration-200 transition-all'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                />

                <div className='flex flex-row space-x-2 hover:cursor-pointer' onClick={() => setShowNewPassword(!showNewPassword)}>
                    <input
                    type="checkbox"
                    id="showPasswordCheckbox"
                    className="hover:cursor-pointer"
                    checked={showNewPassword}
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

export default ChangePassword