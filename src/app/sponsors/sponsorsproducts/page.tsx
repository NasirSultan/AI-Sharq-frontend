'use client';

import React, { useState, useEffect } from 'react';
import api from '@/config/api';
import { FaRobot, FaLaptop, FaMobileAlt, FaHeadphones,FaEdit, FaCamera, FaBox, FaTrash, FaSpinner, FaArrowRight } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store/store';
import Link from 'next/link';

type NotificationType = 'success' | 'error';

const AddSponsorProduct: React.FC = () => {
  const sponsorId = useSelector((state: RootState) => state.sponsor.sponsorId);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [products, setProducts] = useState<any[]>([]);
  const [loadingAdd, setLoadingAdd] = useState(false);
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null);

  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null);

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const getIconByTitle = (title: string) => {
    const lower = title.toLowerCase();
    if (lower.includes('ai')) return <FaRobot className="text-red-900 text-2xl" />;
    if (lower.includes('electronic')) return <FaLaptop className="text-blue-600 text-2xl" />;
    if (lower.includes('mobile')) return <FaMobileAlt className="text-green-600 text-2xl" />;
    if (lower.includes('headphone')) return <FaHeadphones className="text-purple-600 text-2xl" />;
    if (lower.includes('camera')) return <FaCamera className="text-gray-800 text-2xl" />;
    return <FaBox className="text-red-900 text-2xl" />;
  };

  const fetchProducts = async () => {
    if (!sponsorId) return;
    try {
      const response = await api.get(`/sponsor-related/products/sponsor/${sponsorId}`);
      const data = response.data.map((p: any) => ({
        ...p,
        icon: getIconByTitle(p.title)
      }));
      setProducts(data);
    } catch (err) {
      showNotification('Error fetching products', 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorId) return;
    setLoadingAdd(true);
    try {
      const response = await api.post('/sponsor-related/products', {
        sponsorId,
        title: formData.title,
        description: formData.description,
      });

      if (response.status === 200 || response.status === 201) {
        setProducts(prev => [
          ...prev,
          { ...response.data, icon: getIconByTitle(response.data.title) },
        ]);
        setFormData({ title: '', description: '' });
        showNotification('Product added successfully', 'success');
      } else {
        showNotification('Failed to add product', 'error');
      }
    } catch {
      showNotification('Error adding product', 'error');
    } finally {
      setLoadingAdd(false);
    }
  };

  const handleDelete = async (productId: number) => {
    setLoadingDeleteId(productId);
    try {
      await api.delete(`/sponsor-related/products/${productId}`);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showNotification('Product deleted successfully', 'success');
    } catch {
      showNotification('Error deleting product', 'error');
    } finally {
      setLoadingDeleteId(null);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [sponsorId]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 gap-8 relative">
      {notification && (
        <div className={`fixed top-5 right-5 p-2 mt-16 rounded-lg text-white shadow-lg ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-lg flex flex-col gap-4">
     
     
        <h1 className="text-2xl font-medium text-gray-900">Add Sponsor Product</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label>Product Title*</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Product Title"
              className="w-full px-5 py-4 border border-gray-300 rounded-xl"
              required
              disabled={loadingAdd}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Product Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Product Description"
              rows={4}
              className="w-full px-5 py-4 border border-gray-300 rounded-xl resize-none"
              disabled={loadingAdd}
            />
          </div>
          <button
            type="submit"
            className={`py-2 rounded-xl mt-2 text-white flex justify-center items-center ${loadingAdd ? 'bg-red-900' : 'bg-red-900 hover:bg-red-800'}`}
            disabled={loadingAdd}
          >
            {loadingAdd && <FaSpinner className="animate-spin mr-2" />}
            {loadingAdd ? 'Adding...' : 'Add Product'}
          </button>
        </form>
        <Link href="/sponsors/ManageSessions" className="py-2 px-6 bg-white text-red-900 border-2 border-red-900 rounded-xl flex items-center justify-center gap-2 hover:bg-red-900 hover:text-white cursor-pointer"
>
          Back to Home <FaArrowRight />
        </Link>
      </div>

      {products.length > 0 && (
        <div className="w-full max-w-lg flex flex-col gap-4">
          <h2 className="text-xl font-medium text-gray-900">Added Products</h2>
          {products.map(product => (
            <div key={product.id} className="flex items-center justify-between gap-4 p-4 border border-gray-300 rounded-xl bg-white shadow-sm">
              <div className="flex items-center gap-4">
                <div>{product.icon}</div>
                <div className="flex flex-col">
                  <span className="font-medium">{product.title}</span>
                  <span className="text-gray-500">{product.description}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:text-red-600 flex items-center justify-center cursor-pointer"
                disabled={loadingDeleteId === product.id}
              >
                {loadingDeleteId === product.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
              </button>
             {/* <button className="text-blue-600 hover:text-blue-700 flex items-center justify-center cursor-pointer">
  <FaEdit />
</button> */}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddSponsorProduct;
