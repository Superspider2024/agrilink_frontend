import React, { useState, useEffect, useMemo } from 'react';
import LoggedInLayout from '../components/loggedin';
import { PaymentModal } from '../components/payment';
import api from '../api';

const transportOptions = [
  { id: 'boda', name: 'Boda Boda Express', fee: 250, etaDays: 1 },
  { id: 'g4s', name: 'G4S Logistics', fee: 800, etaDays: 2 },
  { id: 'pickup', name: 'Self Pickup', fee: 0, etaDays: 0 },
];

export function BuyersOrders() {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [farmersMap, setFarmersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('accepted');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, productsRes, usersRes] = await Promise.all([
        api.get('/api/orders'),
        api.get('/api/products'),
        api.get('/api/users')
      ]);

      setOrders(ordersRes.data);

      const pMap = productsRes.data.reduce((acc, p) => ({ ...acc, [p._id]: p.name }), {});
      setProductsMap(pMap);
      
      const fMap = usersRes.data.reduce((acc, u) => ({ ...acc, [u._id]: u.name }), {});
      setFarmersMap(fMap);

    } catch (err) {
      setError('Failed to fetch your orders.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FIX #1: The logic now correctly separates 'accepted' from 'paid' (in transit) ---
  const { pending, accepted, rejected, paid, delivered } = useMemo(() => {
    const initial = { pending: [], accepted: [], rejected: [], paid: [], delivered: [] };
    return orders.reduce((acc, order) => {
      if (order.status === 'paid') {
        // If it's accepted AND transporting, it goes to the 'paid' tab.
        if (order.transporting) {
          acc.paid.push(order);
        } else {
        // Otherwise, it stays in the 'accepted' tab.
          acc.accepted.push(order);
        }
      } else {
        // Handle other statuses like pending, rejected, etc.
        const status = order.status === 'declined' ? 'rejected' : order.status;
        acc[status] = acc[status] || [];
        acc[status].push(order);
      }
      return acc;
    }, initial);
  }, [orders]);

  const handleOpenPaymentModal = (order) => {
    setSelectedOrder({
      ...order,
      product: { name: productsMap[order.product] },
      farmer: { name: farmersMap[order.farmer] }
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async (transportDetails) => {
    if (!selectedOrder) return;
    setIsSubmitting(true);
    try {
        const payload = {
            id: selectedOrder._id,
            transport: transportDetails.name,
        };
        await api.post(`/api/transport`, payload);
        
        setIsPaymentModalOpen(false);
        setSuccessMessage('Payment successful! Your order is now in transit.');
        setActiveTab('paid');
        setTimeout(() => setSuccessMessage(''), 5000);
        await fetchData();
    } catch (err) {
        alert('Failed to process payment. Please try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const getFutureDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-KE', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const renderOrders = (orderList, listType) => {
    if (!orderList || orderList.length === 0) {
      return <p className="text-gray-500 text-center py-8">No orders in this category.</p>;
    }
    return orderList.map(order => {
      const totalValue = (parseFloat(order.price) * parseFloat(order.quantity)).toLocaleString();
      return (
        <div key={order._id} className="bg-white p-4 my-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg text-gray-800">{productsMap[order.product] || 'Product Name'}</p>
              <p className="text-sm text-gray-600">Farmer: {farmersMap[order.farmer] || 'Farmer Name'}</p>
              <p className="text-sm text-gray-500">Total Price: <span className="font-semibold">Ksh {totalValue}</span></p>
            </div>
            <p className="text-sm font-semibold text-blue-600 capitalize">{listType}</p>
          </div>
          
          {/* --- FIX #2: The rendering logic is now correct for each tab --- */}
          <div className="mt-3 pt-3 border-t text-sm">
            {listType === 'accepted' && (
              <button onClick={() => handleOpenPaymentModal(order)} className="w-full bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700">
                Arrange & Pay
              </button>
            )}
            {listType === 'paid' && (
              <div className="font-semibold">
                <p className="text-green-600">Status: Paid & In Transit</p>
                {order.transport === 'Self Pickup' 
                  ? <p className="text-yellow-600 mt-1">Ready for Self Pickup</p>
                  : <p className="text-gray-700 mt-1">Transporting via {order.transport} - Est. Arrival: {getFutureDate(2)}</p>
                }
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <LoggedInLayout>
      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        order={selectedOrder} 
        onSubmit={handlePaymentSubmit}
        transportOptions={transportOptions}
        isSubmitting={isSubmitting} 
      />
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">My Orders</h1>
        {successMessage && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4 rounded-md" role="alert"><p>{successMessage}</p></div>}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button onClick={() => setActiveTab('accepted')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'accepted' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Accepted</button>
            <button onClick={() => setActiveTab('paid')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'paid' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Paid & In Transit</button>
            <button onClick={() => setActiveTab('pending')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'pending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Pending</button>
            <button onClick={() => setActiveTab('delivered')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'delivered' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Delivered</button>
            <button onClick={() => setActiveTab('rejected')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'rejected' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Declined</button>
          </nav>
        </div>
        <div className="mt-4">
          {loading && <p>Loading...</p>}
          {error && <p className="text-red-500">{error}</p>}
          {activeTab === 'accepted' && renderOrders(accepted, 'accepted')}
          {activeTab === 'paid' && renderOrders(paid, 'paid')}
          {activeTab === 'pending' && renderOrders(pending, 'pending')}
          {activeTab === 'delivered' && renderOrders(delivered, 'delivered')}
          {activeTab === 'rejected' && renderOrders(rejected, 'rejected')}
        </div>
      </div>
    </LoggedInLayout>
  );
}








