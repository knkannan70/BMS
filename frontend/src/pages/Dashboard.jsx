import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { accountAPI, transactionAPI } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, statementRes] = await Promise.all([
          accountAPI.getProfile(),
          transactionAPI.getStatement(),
        ]);
        setProfile(profileRes.data);
        setRecentTransactions(statementRes.data.slice(0, 5)); // Last 5 transactions
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back, {profile?.fullName}!</h2>
        <p className="text-gray-500 mt-1">Here's a summary of your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 text-white p-6 rounded-xl shadow-md col-span-1 md:col-span-2">
          <div className="text-blue-100 text-sm font-medium mb-1">Available Balance</div>
          <div className="text-4xl font-bold mb-4">${profile?.balance?.toFixed(2)}</div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">Account Number</div>
              <div className="font-mono text-lg tracking-widest">{profile?.accountNumber}</div>
            </div>
            <div className="text-right">
              <div className="text-blue-200 text-xs uppercase tracking-wider mb-1">Status</div>
              <div className="font-medium">{profile?.status}</div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                <a href="/transfer" className="block text-center w-full bg-blue-50 text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-100 transition">Transfer Money</a>
                <a href="/deposit" className="block text-center w-full bg-green-50 text-green-600 py-2 rounded-lg font-medium hover:bg-green-100 transition">Deposit Funds</a>
                <a href="/withdraw" className="block text-center w-full bg-orange-50 text-orange-600 py-2 rounded-lg font-medium hover:bg-orange-100 transition">Withdraw Funds</a>
            </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">Recent Transactions</h3>
          <a href="/statement" className="text-sm font-medium text-blue-600 hover:text-blue-800">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentTransactions.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-4 text-center text-gray-500">No recent transactions</td></tr>
              ) : (
                recentTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tx.transactionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tx.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        tx.transactionType === 'DEPOSIT' || tx.transactionType === 'TRANSFER_IN' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tx.transactionType}
                      </span>
                    </td>
                    <td className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        tx.transactionType === 'DEPOSIT' || tx.transactionType === 'TRANSFER_IN' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                    }`}>
                      {tx.transactionType === 'DEPOSIT' || tx.transactionType === 'TRANSFER_IN' ? '+' : '-'}${tx.amount.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
