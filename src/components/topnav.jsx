import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// We now accept 'userType' as a prop, passed down from LoggedInLayout
export default function TopNav({ userType }) {
  const location = useLocation(); 

  // --- THIS IS THE FIX ---
  // We define different sets of links based on the user's role.
  const navLinks = userType === 'farmer'
    ? [ // Farmer's Links
        { path: '/farmermarketplace', label: 'My Products' },
        { path: '/offers', label: 'Incoming Offers' },
        {/*{ path: '/messages', label: 'Messages' },*/}
      ]
    : [ // Buyer's Links
        { path: '/marketplace', label: 'Marketplace' },
        { path: '/orders', label: 'My Orders' },
        {/*{ path: '/messages', label: 'Messages' },*/}
      ];

  return (
    // "hidden md:block" makes this navbar only appear on medium screens and larger (desktop)
    <div className="bg-white shadow-sm hidden md:block">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`inline-flex items-center px-1 pt-1 pb-2 border-b-2 text-sm font-medium ${
                location.pathname === link.path
                  ? 'border-green-500 text-gray-900' // Style for the active link
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700' // Style for inactive links
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
