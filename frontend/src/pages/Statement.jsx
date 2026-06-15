import { useEffect, useState } from 'react';
import { transactionAPI } from '../services/api';
import { Download } from '@mui/icons-material';

export default function Statement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatement = async () => {
      try {
        const response = await transactionAPI.getStatement();
        setTransactions(response.data);
      } catch (error) {
        // Error handled by interceptor
      } finally {
        setLoading(false);
      }
    };
    fetchStatement();
  }, []);

  const handleDownload = () => {
    // In a real application, this would trigger an API call to download a PDF/Docx
    alert("Download functionality will be implemented soon.");
  };

  if (loading) return <div>Loading statement...</div>;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Account Statement</h3>
          <p className="text-sm text-gray-500">A detailed history of your transactions.</p>
        </div>
        <button 
          onClick={handleDownload}
          className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium transition"
        >
          <Download className="mr-2" fontSize="small" />
          Download PDF
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.length === 0 ? (
              <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No transactions found</td></tr>
            ) : (
              transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(tx.transactionDate).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{tx.description}</td>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">
                    ${tx.balanceAfterTransaction.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
