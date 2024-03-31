import React, { useState } from 'react'
import NavBar from '../Components/navbar';
import axios from 'axios';
import { useNavigate  } from 'react-router-dom';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const token = localStorage.getItem('token');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        try {
        const response = await axios.post(
            'http://localhost/updatePassword',
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
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            localStorage.removeItem('user_role');
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
            {errorMessage && <div className="text-red-600">{errorMessage}</div>}
            <div className={`flex flex-row items-start justify-between space-x-2 w-full`}>
                <p className='text-lg font-semibold'>Ancien mot de passe: </p>
                <input
                type="password"
                id="username"
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                />
            </div>

            <div className='flex flex-row items-start justify-between w-full'>
                <p className='text-lg font-semibold'>Nouveau mot de passe: </p>
                <input
                type="password"
                id="password"
                className='bg-gray-50 border border-gray-300 rounded-lg py-1 px-2 hover:border-gray-800 ease-in-out duration-200 transition-all'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                />
            </div>
            
            <input className='bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 hover:scale-[105%] hover:drop-shadow-lg ease-in-out duration-200 transition-all cursor-pointer' type="submit" value="Changer le mot de passe" />
            </form>
        </div>
        </div>
    </div>
  )
}

export default ChangePassword