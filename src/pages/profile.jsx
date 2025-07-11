import React, { useState, useEffect } from 'react';
import LoggedInLayout from '../components/loggedin';
import api from '../api';

export default function ProfilePage() {
  // State for the main profile data, loading, and errors
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- NEW STATE FOR EDIT MODE ---
  // A boolean to track if we are in "edit mode"
  const [isEditing, setIsEditing] = useState(false);
  // A separate state to hold the form data while editing
  const [editData, setEditData] = useState({ name: '', location: '' });

  // This hook fetches the user's profile data when the page first loads
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Calling your backend route: GET /api/getMe
        const response = await api.get('/api/getMe');
        setProfile(response.data);
        // Pre-fill the edit form data with the fetched profile data
        setEditData({ name: response.data.name, location: response.data.location });
      } catch (err) {
        setError('Failed to fetch profile data. Please log in again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []); // The empty array `[]` means this runs only once.

  // --- NEW FUNCTION TO HANDLE UPDATES ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Calling your backend route: PUT /api/updateprofile
      const response = await api.put('/api/updateprofile', editData);
      
      // Update the main profile state with the new data from the backend
      setProfile(response.data);
      // Exit edit mode
      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- NEW FUNCTION TO HANDLE CHANGES IN THE EDIT FORM ---
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };


  // --- RENDER LOGIC ---
  if (loading && !profile) { // Show loading only on initial load
    return <LoggedInLayout userType="buyer"><div className="text-center py-10">Loading Profile...</div></LoggedInLayout>;
  }
  if (error) {
    return <LoggedInLayout userType="buyer"><div className="text-center py-10 text-red-500">{error}</div></LoggedInLayout>;
  }
  if (!profile) {
    return <LoggedInLayout userType="buyer"><div className="text-center py-10">Could not load profile.</div></LoggedInLayout>;
  }

  return (
    <LoggedInLayout userType={profile.role}>
      <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Profile Header (No changes here) */}
          <div className="bg-gray-100 p-8">
            <div className="flex flex-col items-center">
              <div className="h-32 w-32 rounded-full bg-green-200 text-green-700 flex items-center justify-center text-5xl font-bold">
                {profile.name && profile.name.charAt(0).toUpperCase()}
              </div>
              <h1 className="mt-4 text-3xl font-bold text-gray-900">{profile.name}</h1>
              <p className="mt-1 text-md text-gray-600 capitalize">{profile.role}</p>
            </div>
          </div>
          
          {/* Profile Details & Edit Form */}
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            {isEditing ? (
              // --- SHOW THIS FORM WHEN IN EDIT MODE ---
              <form onSubmit={handleUpdateProfile} className="p-6 space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input type="text" name="name" id="name" value={editData.name} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                  <input type="text" name="location" id="location" value={editData.location} onChange={handleEditChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"/>
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-300">Cancel</button>
                  <button type="submit" disabled={loading} className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400">{loading ? 'Saving...' : 'Save Changes'}</button>
                </div>
              </form>
            ) : (
              // --- SHOW THIS WHEN NOT IN EDIT MODE ---
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.email}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Location</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.location}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">Actions</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <button onClick={() => setIsEditing(true)} className="font-medium text-green-600 hover:text-green-500">Edit Profile</button>
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </LoggedInLayout>
  );
}
