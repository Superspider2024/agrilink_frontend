// src/App.jsx

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import all your page components
import HomePage from './pages/home';
import TermsPage from './pages/terms';
import LoginPage from './pages/login'; 
import SignupPage from './pages/signup'; 
import {Marketplace} from './pages/marketplace';
import {BuyersOrders} from './pages/order';
import {Messages} from './pages/messages'; 
import Profile from './pages/profile';
import { FarmerMarketplacePage } from './pages/farmer';
import { FarmerOffers } from './pages/offers';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/orders" element={<BuyersOrders />} />
        {/*<Route path="/messages" element={<Messages/>} />*/}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/farmermarketplace" element={<FarmerMarketplacePage/>} />
        <Route path ="/offers" element={<FarmerOffers/>} />
        

      </Routes>
    </BrowserRouter>
  );
}

export default App;