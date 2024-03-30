function navbar() {
  const username = localStorage.getItem('username');
  const user_role:String|null = localStorage.getItem('user_role');
  return (
    <div className="w-full flex flex-row items-center justify-around bg-blue-400 py-4">
        <div className="flex flex-row justify-around items-start">
          <a href="/dashboard" ><button className="nav-button">Dashboard</button></a>
          {user_role?.includes('ADMIN') && <a href="/logs" ><button className="nav-button">Logs</button></a>}
          {user_role?.includes('ADMIN') && <a href="/parametres" ><button className="nav-button">Parametres</button></a>}
          {(user_role?.includes('ADMIN') || user_role?.includes('PREP')) && <a href="/clients"><button className="nav-button">Clients</button></a>}
        </div>
        <div className="flex flex-row justify-around items-end space-x-8">
          <button className="nav-button" >Bienvenue, {username}</button>
          <div className="flex flex-col items-end justify-around">
            <a href="/login"><button className="text-white hover:scale-[105%] hover:underline font-semibold ease-in-out duration-200 transition-all">Changer mon mot de passe</button></a>
            <a href="/login"><button className="text-white hover:scale-[105%] hover:underline font-semibold ease-in-out duration-200 transition-all">Me déconnecter</button></a>
          </div>
          
        </div>
    </div>
  )
}

export default navbar