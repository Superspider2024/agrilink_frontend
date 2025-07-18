import React, { useState, useEffect } from 'react';

export function EditOrderModal({ isOpen, onClose, order, onSubmit, isSubmitting }) {
  // State to hold the form data while editing
  const [editData, setEditData] = useState({ price: '', quantity: '' });

  // When the modal opens, pre-fill the form with the order's current data
  useEffect(() => {
    if (order) {
      setEditData({ price: order.price, quantity: order.quantity });
    }
  }, [order]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Your Offer</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="text" name="quantity" id="quantity" value={editData.quantity} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Offer Price</label>
              <input type="number" name="price" id="price" value={editData.price} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

