import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../Components/navbar';
import { Log, User } from '../types';

function Dashboard() {
  const username = localStorage.getItem('username');
  const user_role: string | null = localStorage.getItem('user_role');
  const [logs, setLogs] = useState<Log[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log(token)
    if (token) {
      axios.get<Log[]>('http://localhost:80/getLogs', {
        headers: {
          'x-access-tokens': token,
        },
      })
      .then(logsResponse => {
        console.log('Logs response:', logsResponse.data);
        setLogs(logsResponse.data);
        
        // Fetch users after logs are fetched
        return axios.get<User[]>('http://localhost:80/users', {
          headers: {
            'x-access-tokens': token,
          },
        });
      })
      .then(usersResponse => {
        console.log('Users response:', usersResponse.data);
        setUsers(usersResponse.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, []);

  return (
    <div className='w-full min-h-screen h-full bg-gray-100 pb-20'>
      <NavBar />

      <div className="mx-[20%] mt-8 flex flex-col space-y-8">
        <p className='text-3xl font-bold'>Bienvenue, {username}</p>

        <div className={`${user_role?.includes('ADMIN') ? 'bg-white pt-2 rounded-lg pb-2 shadow-lg':  'hidden'}`}>
          <div className="font-semibold text-xl uppercase text-center underline pb-2">Journalisation des connexions</div>
          <div className=' overflow-y-auto h-80'>
            <table className="table-auto w-full text-center text-sm ">
              <thead className='sticky top-0 bg-white shadow-md'>
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

        <div className={`${user_role?.includes('ADMIN') ? 'bg-white pt-2 rounded-lg pb-2 shadow-lg':  'hidden'}`}>
          <div className="font-semibold text-xl uppercase text-center underline pb-2">Clients</div>
          <div className=' overflow-y-auto h-80'>
            <table className="table-auto w-full text-center text-sm ">
              <thead className='sticky top-0 bg-white shadow-md'>
                <tr className=''>
                  <th className='pl-4 '>Id</th>
                  <th>Username</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody className='font-scp_mono'>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className='pl-4 '> {user.user_id}</td>
                    <td className=''> {user.username}</td>
                    <td className=''> {user.user_role}</td>
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
