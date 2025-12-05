import React, { useState } from 'react';

// THE "JUSTICE" UNITS LOGIC
// This automatically assigns the correct standard based on the crop name
const getUnitName = (productName) => {
  const name = productName.toLowerCase();
  if (name.includes('potato') || name.includes('waru')) return '50kg Bag';
  if (name.includes('tomato') || name.includes('nyanya')) return '64kg Turbo Crate';
  if (name.includes('maize') || name.includes('mahindi')) return '90kg Bag';
  if (name.includes('onion') || name.includes('kitunguu')) return '14kg Net';
  if (name.includes('avocado')) return 'Probox Crate'; 
  return 'Unit'; // Fallback
};

const Marketplace = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState('review'); // 'review' or 'success'

  const unitName = getUnitName(product.name);
  const totalCost = product.price * quantity;

  // SIMULATE M-PESA PAYBILL TRIGGER
  const handleBuy = async () => {
    setLoading(true);
    
    // Simulate API delay (Replace this with real backend call on Monday)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
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
              {/* Fallback image if none exists */}
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                {product.image ? <img src={product.image} className="w-full h-full object-cover rounded-lg"/> : "📦"}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p className="text-green-700 font-bold text-sm">
                  KES {product.price.toLocaleString()} <span className="text-gray-500 font-normal">/ {unitName}</span>
                </p>
              </div>
            </div>

            {/* QUANTITY SELECTOR (Big Buttons for Mobile) */}
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

            {/* TOTAL & PAY BUTTON (Sticky Logic Built-in) */}
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500">Total Amount</span>
                <span className="text-3xl font-bold text-gray-900">
                  KES {totalCost.toLocaleString()}
                </span>
              </div>

              <button 
                onClick={handleBuy}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all
                  ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 shadow-green-200'}
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
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

export default Marketplace;