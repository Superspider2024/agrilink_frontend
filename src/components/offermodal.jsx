import React, { useState } from 'react';

// Added a new prop `isSubmitting` to handle the loading state
export function OfferModal({ isOpen, onClose, product, onSubmit, isSubmitting }) {
  const [offerPrice, setOfferPrice] = useState('');
  const [quantity, setQuantity] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ offerPrice, quantity });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Make an Offer</h2>
        <p className="text-md text-gray-600 mb-6">You are making an offer for: <span className="font-semibold">{product.name}</span></p>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity you want</label>
              <input 
                type="text" 
                name="quantity" 
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder={product.quantity}
              />
            </div>
            <div>
              <label htmlFor="offerPrice" className="block text-sm font-medium text-gray-700">Your Offer Price (per unit, e.g., 110)</label>
              <input 
                type="number" 
                name="offerPrice" 
                id="offerPrice"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                required 
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"
                placeholder={`Farmer's price: ${product.price}`}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Sending...' : 'Submit Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
