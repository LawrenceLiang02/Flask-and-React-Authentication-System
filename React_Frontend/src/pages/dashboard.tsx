import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../Components/navbar';
import { Log, User } from '../types';
import { useNavigate } from 'react-router-dom';
import ChangePasswordAsAdmin from '../Components/changePasswordAsAdmin';
import ChangeRole from '../Components/changeRole';

function Dashboard() {
  const username = localStorage.getItem('username');
  const user_role: string | null = localStorage.getItem('user_role');
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [changePwPopUp, setChangePwPopUp] = useState('');
  const [changeRolePopUp, setChangeRolePopUp] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (user_role == "ADMIN") {
        axios.get<Log[]>('https://localhost:80/getLogs', {
          headers: {
            'x-access-tokens': token,
          },
        })
        .then(logsResponse => {
          console.log('Logs response:', logsResponse.data);
          setLogs(logsResponse.data);
          // console.log(user_role)
          return axios.post<User[]>('https://localhost:80/users', { "user_role": user_role }, {
            headers: {
              'x-access-tokens': token,
            }
          });
        })
        .then(usersResponse => {
          console.log('Users response:', usersResponse.data);
          setUsers(usersResponse.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          // localStorage.removeItem('token');
          // localStorage.removeItem('username');
          // localStorage.removeItem('user_role');
          // navigate("/login");
        });
      }
      else {
        axios.post<User[]>('https://localhost:80/users', { "user_role": user_role }, {
            headers: {
              'x-access-tokens': token,
            }
          })
        .then(usersResponse => {
          console.log('Users response:', usersResponse.data);
          setUsers(usersResponse.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
      }

    }
  }, []);

  return (
    <div className='relative inset-y-0 w-full min-h-screen h-full bg-gray-100 pb-20'>
              
      {changePwPopUp && <ChangePasswordAsAdmin username={changePwPopUp}></ChangePasswordAsAdmin>}
      {changeRolePopUp && <ChangeRole username={changeRolePopUp}></ChangeRole>}
      <NavBar />

      <div className="mx-[20%] mt-8 flex flex-col space-y-8">
        <p className='text-3xl font-bold'>Bienvenue, {username}</p>

        <div className={`${user_role?.includes('ADMIN') ? 'bg-white pt-2 rounded-lg pb-2 shadow-lg':  'hidden'}`}>
          <div className="font-semibold text-xl uppercase text-center underline pb-2">Journalisation des connexions</div>
          <div className=' overflow-y-auto h-80'>
            <table className="table-auto w-full text-center text-sm ">
              <thead className='sticky top-0 bg-gray-200 shadow-md'>
                <tr className=''>
                  <th className='pl-4 '>Id</th>
                  <th>Time</th>
                  <th>Username</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody className='font-scp_mono'>
                {logs.map((log, index) => (
                  <tr  key={index}>
                    <td className='pl-4 '> {log.log_id}</td>
                    <td className=''>{log.event_time && new Date(Number(log.event_time) * 1000).toLocaleString()}</td>
                    <td className=''> {log.username}</td>
                    <td className=''> {log.event_type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${user_role?.includes('ADMIN') || user_role?.includes('PREP') ? 'bg-white pt-2 rounded-lg pb-2 shadow-lg':  'hidden'}`}>
          <div className="font-semibold text-xl uppercase text-center underline pb-2">Clients</div>
          <div className=' overflow-y-auto h-80'>
            <table className="table-auto w-full text-center text-sm ">
              <thead className='sticky top-0 bg-gray-200 shadow-md'>
                <tr className=''>
                  <th className='pl-4 '>Id</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th className={`${user_role?.includes('ADMIN') ? '':  'hidden'}`}>Changer le mot de passe</th>
                  <th className={`${user_role?.includes('ADMIN') ? '':  'hidden'}`}>Changer le role</th>
                </tr>
              </thead>
              <tbody className=''>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className='pl-4 pb-2 pt-2 font-scp_mono'> {user.user_id}</td>
                    <td className='font-scp_mono'> {user.username}</td>
                    <td className='font-scp_mono'> {user.user_role}</td>
                    <td className={`${user_role?.includes('ADMIN') ? '':  'hidden'}`}><button onClick={() => setChangePwPopUp(user.username)} className='bg-blue-400 hover:bg-blue-500 hover:scale-[105%] rounded-lg text-white font-semibold uppercase px-2 py-1'>Changer le mot de passe</button></td>
                    <td className={`${user_role?.includes('ADMIN') ? '':  'hidden'}`}><button onClick={() => setChangeRolePopUp(user.username)} className='bg-blue-400 hover:bg-blue-500 hover:scale-[105%] rounded-lg text-white font-semibold uppercase px-2 py-1'>Changer le role</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      
    </div>
  );
}

export default Dashboard;
