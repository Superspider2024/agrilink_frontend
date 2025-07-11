import React, { useState, useMemo } from 'react';

const transportOptions = [
  { id: 'boda', name: 'Boda Boda Express', fee: 250, eta: 'Est. 1 day' },
  { id: 'g4s', name: 'G4S Logistics', fee: 800, eta: 'Est. 2 days' },
  { id: 'pickup', name: 'Self Pickup', fee: 0, eta: 'N/A' },
];

export function PaymentModal({ isOpen, onClose, order, onSubmit }) {
  const [selectedTransport, setSelectedTransport] = useState(transportOptions[0].id);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { transportFee, totalBill } = useMemo(() => {
    const transport = transportOptions.find(t => t.id === selectedTransport);
    const fee = transport ? transport.fee : 0;
    const price = parseFloat(order?.price) || 0;
    const quantity = parseFloat(order?.quantity) || 1;
    const total = (price * quantity) + fee;
    return { transportFee: fee, totalBill: total };
  }, [selectedTransport, order]);

  if (!isOpen) return null;

  const handleConfirm = async (paymentMethod) => {
    setIsSubmitting(true);
    const transportDetails = transportOptions.find(t => t.id === selectedTransport);
    console.log(`Simulating payment with ${paymentMethod}`);
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    await onSubmit(transportDetails);
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Arrange & Pay</h2>
        <div className="bg-gray-50 p-3 rounded-md mb-4">
          <p className="font-semibold">{order.product?.name || 'Product'}</p>
          <p className="text-sm text-gray-600">From: {order.farmer?.name || 'Farmer'}</p>
        </div>
        
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-gray-900">1. Choose Transport</h3>
          {transportOptions.map(option => (
            <div key={option.id} onClick={() => setSelectedTransport(option.id)} className={`flex justify-between items-center p-3 border rounded-lg cursor-pointer ${selectedTransport === option.id ? 'bg-green-50 border-green-500' : 'border-gray-300'}`}>
              <div>
                <p className="font-semibold">{option.name}</p>
                <p className="text-sm text-gray-500">{option.eta}</p>
              </div>
              <p className="font-semibold">Ksh {option.fee.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <h3 className="text-lg font-medium text-gray-900 mb-2">2. Confirm Bill</h3>
          <div className="flex justify-between text-gray-600"><p>Produce Cost:</p> <p>Ksh {(parseFloat(order?.price || 0) * parseFloat(order?.quantity || 1)).toLocaleString()}</p></div>
          <div className="flex justify-between text-gray-600"><p>Transport Fee:</p> <p>Ksh {transportFee.toLocaleString()}</p></div>
          <div className="flex justify-between text-xl font-bold mt-2"><p>Total Bill:</p> <p className="text-green-600">Ksh {totalBill.toLocaleString()}</p></div>
        </div>

        <div className="mt-6 flex flex-col space-y-3">
           <h3 className="text-lg font-medium text-gray-900">3. Choose Payment Method</h3>
          <button onClick={() => handleConfirm('M-Pesa')} disabled={isSubmitting} className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 flex items-center justify-center">
            {isSubmitting ? 'Processing...' : 'Pay with M-Pesa'}
          </button>
           <button onClick={() => handleConfirm('Card')} disabled={isSubmitting} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center">
            {isSubmitting ? 'Processing...' : 'Pay with Card'}
          </button>
          <button onClick={onClose} className="w-full text-gray-600 py-2 rounded-lg hover:bg-gray-100 !mt-4">Cancel</button>
        </div>
      </div>
    </div>
  );
}

