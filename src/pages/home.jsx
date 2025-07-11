import React from 'react';
import Navbar from '../components/navbar';

//HERO SECTION
function HeroSection() {
    //really good background pic, don't you think?
  const backgroundImageUrl = 'https://images.pexels.com/photos/2602493/pexels-photo-2602493.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

  return (
    // The 'relative' class is crucial for positioning the overlay
    <div className="relative bg-gray-800" style={{ backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      {/* This is the dark overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* This div keeps thE text on top of the overlay and image */}
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl">
          <span className="block">Connecting Farms to Futures</span>
          <span className="block text-green-400">The Alibaba for African Agriculture</span>
        </h1>
        <p className="mt-6 max-w-lg mx-auto text-xl text-gray-200">
          We empower smallholder farmers across Kenya and Africa with direct access to fair markets, logistics, and essential services.
        </p>
        <div className="mt-8 flex justify-center space-x-4">
          <a href="/signup" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            Get Started
          </a>
          <a href="#marketplace" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200">
            Browse Market
          </a>
        </div>
      </div>
    </div>
  );
}


//HOW IT WORKS SECTION 
function HowItWorksSection() {
  // --- ICONS ---
  const ListIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 13h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  );
  const CoinIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
  // --- NEW BOX ICON ---
  const BoxIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  );

  return (
    <div id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            A simple process for farmers and buyers.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Step 1 */}
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mx-auto">
              <ListIcon />
            </div>
            <div className="mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">List Your Produce</h3>
              <p className="mt-2 text-base text-gray-500">
                Farmers create a profile and list their available crops, quantity, and desired price.
              </p>
            </div>
          </div>
          {/* Step 2 */}
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mx-auto">
              <CoinIcon />
            </div>
            <div className="mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Connect with Buyers</h3>
              <p className="mt-2 text-base text-gray-500">
                Buyers browse the marketplace, make offers, and connect directly with farmers to agree on a fair price.
              </p>
            </div>
          </div>
          {/* Step 3 */}
          <div className="text-center">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-green-500 text-white mx-auto">
              <BoxIcon />
            </div>
            <div className="mt-5">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Arrange Delivery</h3>
              <p className="mt-2 text-base text-gray-500">
                Use our integrated logistics partners to handle transport from the farm to the buyer's location, seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


//MARKETPLACE PREVIEW SECTION
function MarketplacePreviewSection() {
  // DUMMY DATA!! WARNING THIS AE FAKE LADS AND LADIES
  const products = [
    { id: 1, name: 'Fresh Tomatoes', farmer: 'Jane Wanjiku', location: 'Limuru', price: 'Ksh 80/kg', imageUrl: 'https://images.pexels.com/photos/533280/pexels-photo-533280.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 2, name: 'Hass Avocados', farmer: 'Peter Omondi', location: 'Kisii', price: 'Ksh 120/kg', imageUrl: 'https://images.pexels.com/photos/557659/pexels-photo-557659.jpeg?auto=compress&cs=tinysrgb&w=600' },
    { id: 3, name: 'Sukuma Wiki (Kale)', farmer: 'Maria Kamau', location: 'Nakuru', price: 'Ksh 50/bunch', imageUrl: 'https://images.pexels.com/photos/750952/pexels-photo-750952.jpeg' },
    { id: 4, name: 'White Maize', farmer: 'David Kiprotich', location: 'Eldoret', price: 'Ksh 3,500/bag', imageUrl: 'https://images.pexels.com/photos/6316526/pexels-photo-6316526.jpeg' },
  ];

  return (
    <div id="marketplace" className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-green-600 tracking-wide uppercase">Marketplace</h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Fresh from the Farm
          </p>
        </div>
        
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img className="h-48 w-full object-cover" src={product.imageUrl} alt={product.name} />
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{product.farmer} - {product.location}</p>
                <p className="mt-4 text-xl font-bold text-green-600">{product.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
          <a href="/signup" className="inline-block px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            View Full Marketplace
          </a>
        </div>
      </div>
    </div>
  );
}


//Home Page Component
export default function home() {
  return (
    <div>
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <MarketplacePreviewSection />
      </main>
    </div>
  );
}


