import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountAPI } from '../services/api';
import { toast } from 'react-toastify';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    address: '',
    mobile: '',
    email: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await accountAPI.getProfile();
      setProfile(response.data);
      setFormData({
        address: response.data.address,
        mobile: response.data.mobile,
        email: response.data.email,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      await accountAPI.updateProfile(formData);
      toast.success('Profile updated successfully');
      fetchProfile();
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Account Details</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-500">Full Name</label>
              <div className="mt-1 text-base text-gray-900 font-medium">{profile?.fullName}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Account Number</label>
              <div className="mt-1 text-base text-gray-900 font-medium">{profile?.accountNumber}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
              <div className="mt-1 text-base text-gray-900 font-medium">{profile?.dob}</div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">Account Status</label>
              <div className="mt-1 text-base text-gray-900 font-medium">{profile?.status}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800">Update Contact Information</h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input 
                name="address" 
                type="text" 
                required 
                value={formData.address}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
                <input 
                  name="mobile" 
                  type="text" 
                  required 
                  value={formData.mobile}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input 
                  name="email" 
                  type="email" 
                  required 
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                />
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button 
                type="submit" 
                disabled={updating}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
