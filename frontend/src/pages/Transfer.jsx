import { useState } from 'react';
import { transactionAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Transfer() {
  const [formData, setFormData] = useState({
    recipientAccountNumber: '',
    amount: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        recipientAccountNumber: formData.recipientAccountNumber,
        amount: parseFloat(formData.amount),
      };
      await transactionAPI.transfer(payload);
      toast.success('Transfer successful!');
      navigate('/');
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl border border-gray-100">
      <div className="p-8">
        <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold mb-1">Transfer Funds</div>
        <p className="block mt-1 text-lg leading-tight font-medium text-black">Send money to another account</p>
        
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Recipient Account Number
            </label>
            <input 
              name="recipientAccountNumber"
              type="text" 
              required
              value={formData.recipientAccountNumber}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="e.g. 0123456789"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount ($)
            </label>
            <input 
              name="amount"
              type="number" 
              min="1" 
              step="0.01"
              required
              value={formData.amount}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition disabled:bg-blue-400"
            >
              {loading ? 'Processing...' : 'Confirm Transfer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
