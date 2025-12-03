'use client'

import React, { useState, useEffect } from 'react'
import api from '@/config/api'
import { useRouter } from 'next/navigation'
import {
  FaRobot,
  FaLaptop,
  FaMobileAlt,
  FaHeadphones,
  FaCamera,
  FaBox,
  FaTrash,
  FaSpinner,
  FaArrowRight,
} from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { RootState } from '@/lib/store/store'

type NotificationType = 'success' | 'error'

const AddExhibitorProduct: React.FC = () => {
  const router = useRouter()
  const exhibitorId = useSelector((state: RootState) => state.exhibitor.exhibitorId)

  const [formData, setFormData] = useState({ title: '', description: '' })
  const [products, setProducts] = useState<any[]>([])
  const [loadingAdd, setLoadingAdd] = useState(false)
  const [loadingDeleteId, setLoadingDeleteId] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: NotificationType } | null>(null)

  const showNotification = (message: string, type: NotificationType = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const getIconByTitle = (title: string) => {
    const lower = title.toLowerCase()
    if (lower.includes('ai')) return <FaRobot className="text-red-600 text-2xl" />
    if (lower.includes('electronic')) return <FaLaptop className="text-red-600 text-2xl" />
    if (lower.includes('mobile')) return <FaMobileAlt className="text-red-600 text-2xl" />
    if (lower.includes('headphone')) return <FaHeadphones className="text-red-600 text-2xl" />
    if (lower.includes('camera')) return <FaCamera className="text-red-600 text-2xl" />
    return <FaBox className="text-red-600 text-2xl" />
  }

  // FIXED: handle API array response safely
  const fetchProducts = async () => {
    if (!exhibitorId) return
    try {
      const response = await api.get(`/exhibitor-products/exhibitor/${exhibitorId}`)
      const data = Array.isArray(response.data) ? response.data : response.data.data

      if (Array.isArray(data)) {
        const updated = data.map((p: any) => ({
          ...p,
          icon: getIconByTitle(p.title),
        }))
        setProducts(updated)
      } else {
        setProducts([])
      }
    } catch (err) {
      console.error('Fetch error:', err)
      showNotification('Error fetching products', 'error')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!exhibitorId) {
      showNotification('Exhibitor ID not found', 'error')
      return
    }
    setLoadingAdd(true)
    try {
      const response = await api.post('/exhibitor-products', {
        exhibitorId,
        title: formData.title,
        description: formData.description,
      })
      const newProduct = response.data
      setProducts(prev => [
        ...prev,
        { ...newProduct, icon: getIconByTitle(newProduct.title) },
      ])
      setFormData({ title: '', description: '' })
      showNotification('Product added successfully', 'success')
    } catch (err) {
      console.error('Add error:', err)
      showNotification('Error adding product', 'error')
    } finally {
      setLoadingAdd(false)
    }
  }

  const handleDelete = async (productId: number) => {
    setLoadingDeleteId(productId)
    try {
      await api.delete(`/exhibitor-products/${productId}`)
      setProducts(prev => prev.filter(p => p.id !== productId))
      showNotification('Product deleted successfully', 'success')
    } catch {
      showNotification('Error deleting product', 'error')
    } finally {
      setLoadingDeleteId(null)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [exhibitorId])

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-4 gap-8 relative">
      {notification && (
        <div
          className={`fixed top-5 right-5 px-6 py-4 rounded-lg text-white shadow-lg ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="bg-white border border-gray-300 rounded-2xl shadow-lg p-10 w-full max-w-lg flex flex-col gap-4">
        <h1 className="text-2xl font-medium text-gray-900">Add Exhibitor Product</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
            placeholder="Product Title"
            className="w-full px-5 py-4 border border-gray-300 rounded-xl"
            required
            disabled={loadingAdd}
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            placeholder="Product Description"
            rows={4}
            className="w-full px-5 py-4 border border-gray-300 rounded-xl resize-none"
            disabled={loadingAdd}
          />

          <button
            type="submit"
            className={`py-4 rounded-xl mt-4 text-white flex justify-center items-center ${
              loadingAdd ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
            }`}
            disabled={loadingAdd}
          >
            {loadingAdd && <FaSpinner className="animate-spin mr-2" />}
            {loadingAdd ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        <button
          onClick={() => router.push('/Exhibitors/ManageSessions')}
          className="mt-4 py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
        >
          Go to Home <FaArrowRight />
        </button>
      </div>

      {products.length > 0 && (
        <div className="w-full max-w-lg flex flex-col gap-4">
          <h2 className="text-xl font-medium text-gray-900">Added Products</h2>
          {products.map(product => (
            <div
              key={product.id}
              className="flex items-center justify-between gap-4 p-4 border border-gray-300 rounded-xl bg-white shadow-sm"
            >
              <div className="flex items-center gap-4">
                <div>{product.icon}</div>
                <div className="flex flex-col">
                  <span className="font-medium">{product.title}</span>
                  <span className="text-gray-500">{product.description}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(product.id)}
                className="text-red-600 hover:text-red-800 flex items-center justify-center"
                disabled={loadingDeleteId === product.id}
              >
                {loadingDeleteId === product.id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaTrash />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AddExhibitorProduct
