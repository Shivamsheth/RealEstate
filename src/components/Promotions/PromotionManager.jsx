// src/components/Promotions/PromotionManager.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';
import { createPromotion, updatePromotion, deletePromotion } from '../../services/promotionService';
import { confirmAlert } from '../../services/alertService';
import Spinner from '../Common/Spinner';

export default function PromotionManager() {
  const { data: promos, loading } = useFirestoreCollection('promotions');
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', discount: '' });

  const openNew = () => {
    setEditingPromo(null);
    setForm({ title: '', description: '', discount: '' });
    setModalOpen(true);
  };

  const openEdit = (promo) => {
    setEditingPromo(promo);
    setForm({ title: promo.title, description: promo.description, discount: promo.discount });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingPromo(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { title, description, discount } = form;
    const payload = { title, description, discount: Number(discount), updatedAt: Date.now() };
    try {
      if (editingPromo) {
        await updatePromotion(editingPromo.id, payload);
        await confirmAlert({ title: 'Updated', text: 'Promotion updated successfully.', icon: 'success' });
      } else {
        await createPromotion({ ...payload, createdAt: Date.now() });
        await confirmAlert({ title: 'Created', text: 'Promotion created successfully.', icon: 'success' });
      }
    } catch (err) {
      await confirmAlert({ title: 'Error', text: err.message, icon: 'error' });
    } finally {
      closeModal();
    }
  };

  const handleDelete = async (promo) => {
    const confirmed = await confirmAlert({
      title: 'Delete Promotion?',
      text: `"${promo.title}" will be removed.`,
      icon: 'warning',
      showCancelButton: true,
    });
    if (!confirmed) return;
    try {
      await deletePromotion(promo.id);
      await confirmAlert({ title: 'Deleted', text: 'Promotion removed.', icon: 'success' });
    } catch (err) {
      await confirmAlert({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  if (loading) {
    return <div className="flex justify-center py-16"><Spinner /></div>;
  }

  return (
    <div className="p-6 bg-gray-800 text-gray-100 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Promotions</h2>
        <button
          onClick={openNew}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
        >
          + New Promotion
        </button>
      </div>

      {promos.length === 0 ? (
        <p className="text-gray-400">No promotions available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Discount (%)</th>
                <th className="px-4 py-2">Last Updated</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {promos.map((p) => (
                <tr key={p.id} className="hover:bg-gray-700">
                  <td className="px-4 py-2">{p.title}</td>
                  <td className="px-4 py-2">{p.discount}</td>
                  <td className="px-4 py-2 text-sm text-gray-400">
                    {new Date(p.updatedAt || p.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-right space-x-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-500 rounded text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="w-full max-w-md bg-gray-900 p-6 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-4">
              {editingPromo ? 'Edit Promotion' : 'New Promotion'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-1">
                  Discount (%)
                </label>
                <input
                  name="discount"
                  type="number"
                  min="1"
                  max="100"
                  value={form.discount}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                >
                  {editingPromo ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}