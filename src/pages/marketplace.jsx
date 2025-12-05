import React, { useState, useEffect, useMemo } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api';

// --- 1. HELPER: STANDARD IMAGES ---
const standardProducts = {
  "Tomatoes": { name: "Fresh Tomatoes", imageUrl: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  "Avocados": { name: "Hass Avocados", imageUrl: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg" },
  "Maize": { name: "White Maize", imageUrl: "https://images.pexels.com/photos/6316510/pexels-photo-6316510.jpeg" },
  "Kale (Sukuma Wiki)": { name: "Sukuma Wiki (Kale)", imageUrl: "https://images.pexels.com/photos/32937515/pexels-photo-32937515.jpeg" },
  "Potatoes": { name: "Irish Potatoes", imageUrl: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg" },
};

const getImageForProduct = (productName) => {
  const productKey = Object.keys(standardProducts).find(key => standardProducts[key].name === productName);
  if (productKey) return standardProducts[productKey].imageUrl;
  return 'https://placehold.co/600x400/cccccc/333333?text=No+Image';
};

// --- 2. HELPER: JUSTICE UNITS LOGIC (Standardizes measurements) ---
const getUnitName = (productName) => {
  const name = productName ? productName.toLowerCase() : "";
  if (name.includes('potato') || name.includes('waru')) return '50kg Bag';
  if (name.includes('tomato') || name.includes('nyanya')) return '64kg Turbo Crate';
  if (name.includes('maize') || name.includes('mahindi')) return '90kg Bag';
  if (name.includes('onion') || name.includes('kitunguu')) return '14kg Net';
  if (name.includes('avocado')) return 'Probox Crate'; 
  return 'Unit'; // Fallback
};

// --- 3. INTERNAL COMPONENT: THE NEW BUY MODAL (No Negotiation + Sticky Footer) ---
const BuyModal = ({ product, onClose, onConfirm }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // 'review' or 'success'

  const unitName = getUnitName(product.name);
  const totalCost = product.price * quantity;

  const handleBuyClick = async () => {
    setLoading(true);
    
    // SIMULATE M-PESA DELAY (3 Seconds)
    // On Monday, you can replace this delay with the real API call waiting
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Call the parent function to actually submit the order to backend
    await onConfirm(quantity, totalCost);
    
    setLoading(false);
    setStep('success');
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
      
      {/* MODAL CARD */}
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl p-6 shadow-2xl overflow-hidden relative">
        
        {/* CLOSE BUTTON */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
        >
          ✕
        </button>

        {/* --- STEP 1: REVIEW ORDER --- */}
        {step === 'review' && (
          <>
            <div className="text-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Confirm Order</h2>
              <p className="text-sm text-gray-500">No bargaining. Fixed Price.</p>
            </div>

            {/* PRODUCT SUMMARY */}
            <div className="flex items-center gap-4 bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm overflow-hidden">
                 <img src={getImageForProduct(product.name)} className="w-full h-full object-cover"/>
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-green-700 font-bold text-sm">
                  Ksh {product.price.toLocaleString()} <span className="text-gray-500 font-normal">/ {unitName}</span>
                </p>
              </div>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mb-8">
              <label className="block text-center text-sm font-medium text-gray-600 mb-3">
                How many <span className="font-bold text-black">{unitName}s</span> do you want?
              </label>
              
              <div className="flex items-center justify-center gap-6">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-14 h-14 rounded-full border-2 border-gray-200 text-gray-600 text-2xl font-bold active:bg-gray-100 touch-manipulation"
                >−</button>
                
                <span className="text-4xl font-bold text-gray-900 w-16 text-center">{quantity}</span>
                
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-14 h-14 rounded-full bg-green-600 text-white text-2xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-transform touch-manipulation"
                >+</button>
              </div>
            </div>

            {/* STICKY BOTTOM ACTION BAR */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-3xl font-bold text-gray-900">
                  Ksh {totalCost.toLocaleString()}
                </span>
              </div>

              <button 
                onClick={handleBuyClick}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    {/* Simple Spinner */}
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Check your Phone...
                  </span>
                ) : (
                  `Pay via M-Pesa Now`
                )}
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">
                Secured by Safaricom Paybill
              </p>
            </div>
          </>
        )}

        {/* --- STEP 2: SUCCESS MESSAGE --- */}
        {step === 'success' && (
          <div className="text-center py-8 animate-in zoom-in">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed!</h2>
            <p className="text-gray-600 mb-6">
              We have sent a confirmation SMS to the farmer. A rider will contact you shortly.
            </p>
            <button 
              onClick={onClose}
              className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold"
            >
              Back to Market
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

// --- 4. MAIN COMPONENT: MARKETPLACE ---
export function Marketplace() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productsResponse = await api.get('/api/products');
        const usersResponse = await api.get('/api/users'); 
        
        setProducts(productsResponse.data);

        // Map users for display
        const usersMap = usersResponse.data.reduce((acc, user) => {
          acc[user._id] = user.name;
          return acc;
        }, {});
        setUsers(usersMap);

      } catch (err) {
        setError('Failed to fetch data from the market.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenOfferModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // NEW LOGIC: NO NEGOTIATION, JUST FIXED PRICE
  const handleConfirmOrder = async (quantity, totalCost) => {
    if (!selectedProduct) return;
    try {
      const payload = {
        productId: selectedProduct._id,
        farmerId: selectedProduct.farmer,
        price: selectedProduct.price, // FIXED PRICE (No counter offer)
        quantity: quantity,
      };

      await api.post(`/api/order`, payload);
      // Success handled in the modal visual state
      console.log("Order submitted to backend");

    } catch (err) {
      alert('Failed to send order. Please try again.');
      console.error(err);
    }
  };

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products;
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <LoggedInLayout>
      {/* INTERNAL MODAL RENDERED HERE */}
      {isModalOpen && (
        <BuyModal 
          product={selectedProduct} 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={handleConfirmOrder} 
        />
      )}

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 pb-32"> {/* Added pb-32 for mobile scroll space */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Marketplace</h1>
        
        <div className="mb-6">
          <input
            type="search"
            placeholder="Search by produce or location..."
            className="w-full p-4 rounded-lg shadow-md border-gray-200 focus:ring-green-500 focus:border-green-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading && <p>Loading market...</p>}
        {error && <p className="text-red-500">{error}</p>}
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              <img className="h-48 w-full object-cover" src={getImageForProduct(product.name)} alt={product.name} />
              
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                
                <p className="mt-1 text-sm text-gray-500">
                  by {users[product.farmer] || 'Unknown Farmer'} from {product.location}
                </p>
                
                {/* DYNAMIC UNIT DISPLAY (The Justice Logic) */}
                <p className="mt-4 text-xl font-bold text-green-600 flex-grow">
                  Ksh {product.price} <span className="text-sm text-gray-500 font-normal">/ {getUnitName(product.name)}</span>
                </p>
                
                <button 
                  onClick={() => handleOpenOfferModal(product)} 
                  className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 shadow-md"
                >
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoggedInLayout>
  );
}