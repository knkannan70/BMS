import { useState } from 'react';
import { transactionAPI } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export default function Withdraw() {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { amount: parseFloat(amount) };
      await transactionAPI.withdraw(payload);
      toast.success('Withdrawal successful!');
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
        <div className="uppercase tracking-wide text-sm text-orange-600 font-semibold mb-1">Withdraw Funds</div>
        <p className="block mt-1 text-lg leading-tight font-medium text-black">Take money out of your account</p>
        
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Amount ($)
            </label>
            <input 
              type="number" 
              min="1" 
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
              placeholder="0.00"
            />
          </div>
          <div className="flex items-center justify-between mt-8">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline transition disabled:bg-orange-400"
            >
              {loading ? 'Processing...' : 'Confirm Withdrawal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
