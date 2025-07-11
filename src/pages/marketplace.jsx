import React, { useState, useEffect, useMemo } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api';
import { OfferModal } from '../components/Offermodal'; 

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

export function Marketplace() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState({}); // To store farmer data for lookup
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // For offer submission
  
  // State for the Offer Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- FIX #1: State for the search term ---
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // We fetch both products and users at the same time
        const productsResponse = await api.get('/api/products');
        const usersResponse = await api.get('/api/users'); // Assuming you have a route to get all users
        
        setProducts(productsResponse.data);

        // --- FIX #2: Create a lookup map for farmer names ---
        // Your backend sends the array directly, so we use usersResponse.data
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

  const handleOfferSubmit = async (offerData) => {
    if (!selectedProduct) return;
    setIsSubmitting(true);
    setSuccessMessage('');
    try {
      const payload = {
        productId: selectedProduct._id,
        farmerId: selectedProduct.farmer,
        price: offerData.offerPrice,
        quantity: offerData.quantity,
      };

      await api.post(`/api/order`, payload);
      
      // --- FIX #3: Set a professional success message instead of an alert ---
      setSuccessMessage(`Your offer for ${selectedProduct.name} has been sent!`);
      setIsModalOpen(false);
      
      // Hide the success message after a few seconds
      setTimeout(() => setSuccessMessage(''), 5000);

    } catch (err) {
      alert('Failed to send offer. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Derived state for filtering products based on search term ---
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <LoggedInLayout>
      <OfferModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} onSubmit={handleOfferSubmit} isSubmitting={isSubmitting} />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Marketplace</h1>
        
        {/* --- FIX #3: Display the success message --- */}
        {successMessage && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded-md" role="alert">
            <p className="font-bold">Success</p>
            <p>{successMessage}</p>
          </div>
        )}

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
                {/* --- FIX #2: Use the users map to display the farmer's name --- */}
                <p className="mt-1 text-sm text-gray-500">by {users[product.farmer] || 'Unknown Farmer'} from {product.location}</p>
                <p className="mt-4 text-xl font-bold text-green-600 flex-grow">Ksh {product.price} /kg</p>
                <button onClick={() => handleOpenOfferModal(product)} className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700">Make an Offer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoggedInLayout>
  );
}

