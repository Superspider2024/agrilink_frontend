import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import TopNav from './topnav';

// --- SVG Icons (No changes needed here) ---
const MarketplaceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const OrdersIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>;
const MessagesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>;


// --- Top Header Component ---
const TopHeader = ({ user, onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-green-600">AgriLink</Link>
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Welcome, {user ? user.name : 'Guest'}</span>
            <Link to="/profile">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </button>
            </Link>
            <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-800">Logout</button>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Bottom Navigation Component ---
const BottomNav = ({ user }) => {
  const location = useLocation();
  console.log(user.role)
  if (!user) return null;

  const navLinks = user.role.trim().toLowerCase() === 'farmer'
    ? [{ path: '/offers', label: 'Offers', icon: <OrdersIcon /> },
       { path: '/marketplace', label: 'My Products', icon: <MarketplaceIcon /> },
       { path: '/messages', label: 'Messages', icon: <MessagesIcon /> }]
    : [{ path: '/orders', label: 'Orders', icon: <OrdersIcon /> },
       { path: '/marketplace', label: 'Marketplace', icon: <MarketplaceIcon /> },
       {/*{ path: '/messages', label: 'Messages', icon: <MessagesIcon /> }*/}];

  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white shadow-t-lg rounded-t-2xl z-50 md:hidden">
      <div className="flex justify-around items-center h-16">
        {navLinks.map((link) => (
          <Link key={link.path} to={link.path} className={`flex flex-col items-center justify-center w-full text-sm font-medium transition-colors duration-200 ${location.pathname === link.path ? 'text-green-600' : 'text-gray-500 hover:text-green-600'}`}>
            {link.icon}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};


// --- The Main Layout Component ---
export default function LoggedInLayout({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        // --- THIS IS THE FIX ---
        // We parse the string from localStorage back into a JavaScript object.
        const parsedUser = JSON.parse(storedUser);
        console.log(parsedUser)
        setUser(parsedUser);
      } catch (error) {
        // If parsing fails, the data is corrupt. Log out the user.
        console.error("Failed to parse user data from localStorage", error);
        handleLogout();
      }
    } else {
      // If no user is found in localStorage, they shouldn't be here. Redirect to login.
      navigate('/login');
    }
  }, []); // We remove navigate from dependency array to prevent potential loops

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };
  
  // Don't render anything until we have the user info
  if (!user) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; // Or a proper spinner component
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      <TopHeader user={user} onLogout={handleLogout} />
      <TopNav userType={user.role} /> 
      <main className="pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav user={user} />
    </div>
  );
}

