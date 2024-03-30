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
        <div>
          <button className="nav-button" >Bienvenue, {username}</button>
          <a href="/login"><button className="nav-button"  >Logout</button></a>
        </div>
    </div>
  )
}

export default navbar