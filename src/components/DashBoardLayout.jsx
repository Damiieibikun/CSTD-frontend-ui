import { useContext, useEffect } from 'react';
import Nav from './Nav';
import Sidenav from './Sidenav';
import { useNavigate } from 'react-router-dom';
import { ApiContext } from '../context/apiContext';

const DashboardLayout = ({ children }) => {
  // const [currentAdmin, setCurrentAdmin] = useState(null); 
  const {currentAdmin, setCurrentAdmin} =useContext(ApiContext)
  const navigate = useNavigate();
  
    useEffect(() => {
      const storedAdmin = JSON.parse(localStorage.getItem('loggedCSTDAdmin'));
      setCurrentAdmin(storedAdmin);
       if (!storedAdmin || !storedAdmin?.role) {
    navigate('/');
    return;
  }
    }, [navigate, setCurrentAdmin]);
  return (
    <div className="flex">
      <Sidenav 
      loggedAdmin={currentAdmin?.id && currentAdmin}
      />
      <main className="md:ml-64 ml-20 w-full min-h-screen p-6 bg-gray-50">
      <Nav
      loggedAdmin={currentAdmin?.id && currentAdmin}
      />
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
