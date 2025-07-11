import React, { useState, useEffect } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api'; // Our API connector

// --- Updated with new, stable image URLs ---
const standardProducts = {
  "Tomatoes": { name: "Fresh Tomatoes", imageUrl: "https://images.pexels.com/photos/1327838/pexels-photo-1327838.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" },
  "Avocados": { name: "Hass Avocados", imageUrl: "https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg" },
  "Maize": { name: "White Maize", imageUrl: "https://images.pexels.com/photos/6316510/pexels-photo-6316510.jpeg" },
  "Kale (Sukuma Wiki)": { name: "Sukuma Wiki (Kale)", imageUrl: "https://images.pexels.com/photos/32937515/pexels-photo-32937515.jpeg" },
  "Potatoes": { name: "Irish Potatoes", imageUrl: "https://images.pexels.com/photos/144248/potatoes-vegetables-erdfrucht-bio-144248.jpeg" },
};


// --- Reusable Modal for Adding/Editing Products ---
const ProductModal = ({ isOpen, onClose, onSubmit, product, setProduct, isSubmitting }) => {
  if (!isOpen) return null;
  const isEditing = product && product._id;

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e) => {
    const selectedType = e.target.value;
    setProduct({
      ...product,
      name: standardProducts[selectedType].name,
      imageUrl: standardProducts[selectedType].imageUrl,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">{isEditing ? 'Edit Product' : 'Add a New Product'}</h2>
        <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
          <div className="space-y-4">
            <div>
              <label htmlFor="productType" className="block text-sm font-medium text-gray-700">Product Type</label>
              <select id="productType" onChange={handleTypeChange} defaultValue={Object.keys(standardProducts).find(key => standardProducts[key].name === product.name) || Object.keys(standardProducts)[0]} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md">
                {Object.keys(standardProducts).map(key => (
                  <option key={key} value={key}>{standardProducts[key].name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (Numbers only, e.g., 120)</label>
              <input type="number" name="price" value={product.price || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="120"/>
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">Quantity (e.g., 250 kg)</label>
              <input type="text" name="quantity" value={product.quantity || ''} onChange={handleChange} required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3"/>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea name="description" rows={3} value={product.description || ''} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" placeholder="e.g., Grade A, ready for export."></textarea>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-3">
            <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
              {isSubmitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Product')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- The Main Farmer Marketplace Page ---
export function FarmerMarketplacePage() {
  const [myProducts, setMyProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // New state for modal loading

  const fetchMyProducts = async () => {
    try {
      setLoading(true);
      const loggedInUser = JSON.parse(localStorage.getItem('user'));
      if (!loggedInUser) throw new Error('No user found');

      const response = await api.get('/api/products');
      
      const filteredProducts = response.data.filter(p => p.farmer === loggedInUser._id);
      setMyProducts(filteredProducts);

    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const handleOpenAddModal = () => {
    const defaultType = Object.keys(standardProducts)[0];
    setEditingProduct({
      name: standardProducts[defaultType].name,
      imageUrl: standardProducts[defaultType].imageUrl,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/deleteproduct/${productId}`);
        fetchMyProducts();
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  const handleFormSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user) throw new Error('User not found');

      const productData = {
        ...editingProduct,
        location: user.location,
        imageUrl: editingProduct.imageUrl || Object.values(standardProducts).find(p => p.name === editingProduct.name)?.imageUrl,
      };

      if (editingProduct && editingProduct._id) {
        await api.put(`/api/updateproduct/${editingProduct._id}`, productData);
      } else {
        await api.post('/api/createproduct', productData);
      }
      setIsModalOpen(false);
      fetchMyProducts();
    } catch (err) {
      setError('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- THIS IS THE FIX ---
  // A helper function to find the correct image URL based on the product name.
  const getImageForProduct = (productName) => {
    const productKey = Object.keys(standardProducts).find(key => standardProducts[key].name === productName);
    if (productKey) {
      return standardProducts[productKey].imageUrl;
    }
    // Return a default placeholder if no match is found
    return 'https://placehold.co/600x400/cccccc/333333?text=No+Image';
  };

  return (
    <LoggedInLayout>
      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        product={editingProduct}
        setProduct={setEditingProduct}
        isSubmitting={isSubmitting}
      />
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
          <button onClick={handleOpenAddModal} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700">+ Add New Product</button>
        </div>
        {loading && <p>Loading your products...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && myProducts.length === 0 && <p>You haven't listed any products yet.</p>}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myProducts.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
              {/* The img src now uses our helper function */}
              <img className="h-48 w-full object-cover" src={getImageForProduct(product.name)} alt={product.name} />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.quantity} bags</p>
                <p className="mt-2 text-xl font-bold text-green-600 flex-grow">Ksh {product.price} /kg</p>
                <div className="mt-4 flex space-x-2">
                  <button onClick={() => handleOpenEditModal(product)} className="w-full bg-blue-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-blue-600">Edit</button>
                  <button onClick={() => handleDelete(product._id)} className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold text-sm hover:bg-red-600">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </LoggedInLayout>
  );
}



