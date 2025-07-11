
// Import the Link component from React Router
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo - */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-green-600">
              AgriLink
            </Link>
          </div>

          {/* Main Nav Links for Desktop( I;m thinking also mobile) */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="/#how-it-works" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">How It Works</a>
              <a href="/#marketplace" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Marketplace</a>
              {/* Terms */}
              <Link to="/terms" className="text-gray-600 hover:bg-green-600 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Terms & Conditions</Link>
            </div>
          </div>

          {/* Login/Signup Buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-2">
              <Link to="/login" className="text-gray-800 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md text-sm font-medium">
                Log In
              </Link>
              <Link to="/signup" className="text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-md text-sm font-medium">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}