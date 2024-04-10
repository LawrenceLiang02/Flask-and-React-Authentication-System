import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

function Navbar() {
  const cookies = new Cookies();

  function getCookieValue(cookieName: string): string | undefined {
      return cookies.get(cookieName);
  }

  function removeCookie(cookieName: string) {
      cookies.remove(cookieName, { path: '/' });
  }

  
  const username = getCookieValue('username');
  const user_role = getCookieValue('user_role');
  const navigate = useNavigate();
  
  function logOut(){
    removeCookie('token');
    removeCookie('username');
    removeCookie('user_role');
    navigate("/login");
  }
  return (
    <div className="w-full sticky z-10 top-0 left-0 flex flex-row items-center justify-around bg-blue-400 py-4 shadow-xl">
        <div className="flex flex-row justify-around items-start">
          <a href="/dashboard" ><button className="nav-button">Dashboard</button></a>
          {user_role?.includes('ADMIN') && <a href="/dashboard" ><button className="nav-button">Logs</button></a>}
          {user_role?.includes('ADMIN') && <a href="/passwordComplexityForm" ><button className="nav-button">Parametres</button></a>}
          {(user_role?.includes('ADMIN') || user_role?.includes('PREP')) && <a href="/dashboard"><button className="nav-button">Clients</button></a>}
        </div>
        <div className="flex flex-row justify-around items-end space-x-8">
          <button className="nav-button" >Bienvenue, {username}</button>
          <div className="flex flex-col items-end justify-around">
            <a href="/changePassword"><button className="text-white hover:scale-[105%] hover:underline font-semibold ease-in-out duration-200 transition-all">Changer mon mot de passe</button></a>
            <button className="text-white hover:scale-[105%] hover:underline font-semibold ease-in-out duration-200 transition-all" onClick={logOut}>Me déconnecter</button>
          </div>
          
        </div>
    </div>
  )
}

export default Navbar