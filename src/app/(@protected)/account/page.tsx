'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/context/useAuth'
import Head from 'next/head'

const AccountPage = () => {
  const { user, updateAccountDetails, logout,isLoggingOut } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
  name: user?.name || '',
  phone_no: user?.phone_no || '',
  address: user?.address || ''
})
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

useEffect(() => {
  if (user) {
    setFormData({
      name: user.name || '',
      phone_no: user.phone_no || '',
      address: user.address || ''
    })
  }
}, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setFormData(prev => ({ 
    ...prev, 
    [name]: value || '' // Ensure empty string instead of undefined
  }))
}

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone_no: user.phone_no || '',
        address: user.address || ''
      })
    }
    setIsEditing(false)
    setError('')
    setSuccess('')
  }

  
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsLoading(true)
  setError('')
  setSuccess('')

  try {
    const result = await updateAccountDetails(formData)
    
    if (!result.success) {
      throw new Error(result.error || 'Failed to update profile')
    }

    setSuccess('Profile updated successfully!')
    setIsEditing(false)
  } catch (err) {
    setError(err instanceof Error ? err.message : 'Failed to update profile')
  } finally {
    setIsLoading(false)
  }
}

//   if (!user && isLoading) {
//   return <div className="bg-gray-50 font-['Poppins'] text-black flex justify-center items-center h-screen">Loading...</div>
// }

if (!user) {
  return (
    <div className="bg-gray-50 font-['Poppins'] text-black flex justify-center items-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
        <p className="mt-4">Loading your account information...</p>
      </div>
    </div>
  )
}

  // Format created_at date
 const memberSince = user.created_at 
  ? new Date(user.created_at).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    })
  : 'Unknown date'

  return (
    <>
      <main className="bg-gray-50 font-['Poppins']">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center text-sm text-gray-600">
            <a href="/" className="hover:text-pink-600">Home</a>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">My Account</span>
          </div>
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-['Playfair_Display'] font-bold text-gray-900">
              My Account
            </h1>
            <p className="text-gray-600 mt-2">Manage your profile and account settings</p>
          </div>
          
          {/* Profile Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Profile Card and Personal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="relative">
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                      alt="Profile" 
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                    />
                    <label className="absolute bottom-0 right-0 bg-pink-600 p-2 rounded-full cursor-pointer hover:bg-purple-600 transition-all">
                      <input type="file" className="hidden" accept="image/*" id="profileImageInput" />
                      <i className="fas fa-camera text-white text-sm"></i>
                    </label>
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-800">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                    <p className="text-sm text-gray-500 mt-1">Member since {memberSince}</p>
                  </div>
                </div>
              </div>
              
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-800">Personal Information</h2>
                  {!isEditing ? (
                    <button 
                      onClick={handleEdit}
                      className="text-pink-600 hover:text-purple-600 font-medium"
                    >
                      <i className="fas fa-edit mr-1"></i> Edit Profile
                    </button>
                  ) : null}
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
                        disabled={!isEditing}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={user.email}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-600 text-black cursor-not-allowed"
                        disabled
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
                        disabled={!isEditing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-600 text-black"
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                  
                  {isEditing && (
                    <div className="mt-6">
                      <button 
                        type="submit" 
                        disabled={isLoading}
                        className="bg-gradient-to-r from-pink-600 to-orange-500 text-white py-3 px-6 rounded-lg font-medium mr-4 disabled:opacity-50"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button" 
                        onClick={handleCancel}
                        className="bg-gray-500 text-white py-3 px-6 rounded-lg font-medium"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </form>

                {error && (
                  <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg">
                    {success}
                  </div>
                )}
              </div>
            </div>
            
            {/* Right Column - Security, Activity, Actions */}
            <div className="lg:col-span-1 space-y-6">
              {/* Security Settings */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-800 mb-4">Security Settings</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Change Password</h3>
                    <p className="text-sm text-gray-600 mb-3">Last changed: 30 days ago</p>
                    <button className="w-full bg-pink-600 bg-opacity-10 text-pink-600 py-2 px-4 rounded-lg hover:bg-opacity-20 transition-all">
                      Update Password
                    </button>
                  </div>
                  
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-600 mb-3">Status: Enabled</p>
                    <button className="w-full bg-pink-600 bg-opacity-10 text-pink-600 py-2 px-4 rounded-lg hover:bg-opacity-20 transition-all">
                      Manage 2FA
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-800 mb-4">Recent Activity</h2>
                
                <div className="space-y-3">
                  <div className="flex items-start p-3 bg-gray-50 rounded-lg">
                    <div className="bg-pink-600 bg-opacity-10 p-2 rounded-full mr-3">
                      <i className="fas fa-sign-in-alt text-pink-600"></i>
                    </div>
                    <div>
                      <h3 className="text-gray-800 font-medium">Logged In</h3>
                      <p className="text-sm text-gray-600">{new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                      <span className="text-xs text-green-500 font-medium">Successful</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Account Actions */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-2xl font-['Playfair_Display'] font-bold text-gray-800 mb-4">Account Actions</h2>
                
                <div className="space-y-3">
                  <button 
                    onClick={logout}
                    disabled={isLoggingOut}
                    className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 transition-all"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i> 
                    {isLoggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                  <button className="w-full bg-gray-500 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all">
                    <i className="fas fa-trash-alt mr-2"></i> Delete Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default AccountPage