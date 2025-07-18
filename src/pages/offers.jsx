import React, { useState, useEffect, useMemo } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api';

export function FarmerOffers() {
  const [offers, setOffers] = useState([]);
  const [productsMap, setProductsMap] = useState({});
  const [buyersMap, setBuyersMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('pending');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [offersRes, productsRes, usersRes] = await Promise.all([
        api.get('/api/offers'),
        api.get('/api/products'),
        api.get('/api/users')
      ]);
      setOffers(offersRes.data);
      const pMap = productsRes.data.reduce((acc, p) => ({ ...acc, [p._id]: p.name }), {});
      setProductsMap(pMap);
      const bMap = usersRes.data.reduce((acc, u) => ({ ...acc, [u._id]: u.name }), {});
      setBuyersMap(bMap);
    } catch (err) {
      setError('Failed to fetch your offers.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOfferUpdate = async (offerId, action) => {
    const route = action === 'accept' ? `/api/acceptoffer/${offerId}` : `/api/declineoffer/${offerId}`;
    try {
      await api.put(route);
      setSuccessMessage(`Offer successfully ${action}ed!`);
      fetchData();
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setError(`Failed to ${action} offer.`);
    }
  };

  // --- FIX: Defined the 'initial' object before using it in the reduce function ---
  const { pending, accepted, rejected, delivered, inTransit } = useMemo(() => {
    const initialAccumulator = { pending: [], accepted: [], rejected: [], delivered: [], inTransit: [] };
    return offers.reduce((acc, offer) => {
      if (offer.status === 'paid' && offer.transporting === true) {
        acc.inTransit.push(offer);
      } else {
        const status = offer.status === 'declined' ? 'rejected' : offer.status;
        acc[status] = acc[status] || [];
        acc[status].push(offer);
      }
      return acc;
    }, initialAccumulator);
  }, [offers]);

  const getFutureDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-KE', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const renderOffers = (offerList, listType) => {
    if (!offerList || offerList.length === 0) {
      return <p className="text-gray-500 text-center py-8">No items in this category.</p>;
    }
    return offerList.map(offer => {
      const totalValue = (parseFloat(offer.price) * parseFloat(offer.quantity)).toLocaleString();
      return (
        <div key={offer._id} className="bg-white p-4 my-2 rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-bold text-lg text-gray-800">{productsMap[offer.product] || 'Product Name'}</p>
              <p className="text-sm text-gray-600">Buyer: {buyersMap[offer.buyer] || 'Buyer Name'}</p>
              <p className="text-sm text-gray-500">Offer: Ksh {offer.price} for {offer.quantity}</p>
            </div>
            <p className="text-sm font-semibold text-blue-600 capitalize">{listType}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-gray-100 text-sm">
            {listType === 'accepted' && (
              <p className="text-yellow-600 font-semibold">Awaiting Pickup by Buyer</p>
            )}
            {listType === 'inTransit' && (
              <div className="font-semibold">
                <p className="text-green-600">In Transit</p>
                <p className="text-gray-700 mt-1">Via {offer.transport} - Est. Arrival: {getFutureDate(2)}</p>
                <p className="text-gray-800 font-bold mt-1">Total Deal Value: Ksh {totalValue}</p>
              </div>
            )}
            {listType === 'delivered' && (
              <div className="font-semibold">
                <p className="text-gray-700">Delivered on {new Date(offer.dateJoined).toLocaleDateString()}</p>
                <p className="text-gray-800 font-bold mt-1">Total Sale Value: Ksh {totalValue}</p>
              </div>
            )}
            {listType === 'pending' && (
              <div className="flex space-x-3">
                <button onClick={() => handleOfferUpdate(offer._id, 'accept')} className="text-sm font-medium text-green-600 hover:text-green-800">Accept</button>
                <button onClick={() => handleOfferUpdate(offer._id, 'decline')} className="text-sm font-medium text-red-600 hover:text-red-800">Decline</button>
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <LoggedInLayout>
      <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Incoming Offers & Sales</h1>
        {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded-md mb-4">{successMessage}</div>}
        {error && <div className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</div>}
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-6 overflow-x-auto">
            <button onClick={() => setActiveTab('pending')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'pending' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Pending</button>
            <button onClick={() => setActiveTab('accepted')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'accepted' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Accepted</button>
            <button onClick={() => setActiveTab('inTransit')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'inTransit' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>In Transit</button>
            <button onClick={() => setActiveTab('delivered')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'delivered' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Delivered</button>
            <button onClick={() => setActiveTab('rejected')} className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${activeTab === 'rejected' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500'}`}>Declined</button>
          </nav>
        </div>
        <div className="mt-4">
          {loading && <p>Loading offers...</p>}
          {activeTab === 'pending' && renderOffers(pending, 'pending')}
          {activeTab === 'accepted' && renderOffers(accepted, 'accepted')}
          {activeTab === 'inTransit' && renderOffers(inTransit, 'inTransit')}
          {activeTab === 'delivered' && renderOffers(delivered, 'delivered')}
          {activeTab === 'rejected' && renderOffers(rejected, 'rejected')}
        </div>
      </div>
    </LoggedInLayout>
  );
}



