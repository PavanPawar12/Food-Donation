import React, { useEffect, useState } from 'react';
import api from '../api/api';
import { FaMapMarkerAlt, FaUtensils, FaClock } from 'react-icons/fa';
import { toast } from 'react-toastify';

const Claimed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/donations/claimed-by-me');
        setItems(data?.data?.donations || []);
      } catch (e) {
        toast.error('Failed to load claimed donations');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Claimed Food</h1>
          <p className="text-gray-600">Donations you have successfully claimed</p>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-12 text-gray-600">No claimed donations yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((d) => (
              <div key={d._id} className="bg-white rounded-xl shadow p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">{d.title}</h3>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">claimed</span>
                </div>
                <p className="text-gray-700 mb-4">{d.description}</p>
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><FaUtensils className="text-green-600" /> {d.quantity?.amount} {d.quantity?.unit}</div>
                  <div className="flex items-center gap-2"><FaClock className="text-red-600" /> Expires: {d.expiryTime ? new Date(d.expiryTime).toLocaleString() : '-'}</div>
                  <div className="flex items-center gap-2 col-span-2"><FaMapMarkerAlt className="text-blue-600" /> {d.fullAddress || d.location?.address?.street || '-'}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Claimed;


