// src/components/Admin/PropertyManager.jsx
import React, { useState } from 'react';
import Spinner from '../Common/Spinner';
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from '../../services/propertyService';
import { confirmAlert } from '../../services/alertService';
import { useFirestoreCollection } from '../../hooks/useFirestoreCollection';

export default function PropertyManager() {
  const { data: props, loading } = useFirestoreCollection('properties');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: '',
    price: 0,
    area: 0,
    size: 1,
    status: 'available',
    address: '',
    description: '',
    imageFiles: [],
  });
  const [uploadProgress, setUploadProgress] = useState({}); 

  if (loading) return <Spinner />;

  const openForm = prop => {
    if (prop) {
      setEditing(prop.id);
      setForm({ ...prop, imageFiles: [], images: prop.images || [] });
    } else {
      setEditing(null);
      setForm({
        title: '', price: 0, area: 0, size: 1,
        status: 'available', address: '',
        description: '', imageFiles: [], images: []
      });
    }
  };

  const handleFileChange = e => {
    setForm(f => ({
      ...f,
      imageFiles: Array.from(e.target.files)
    }));
  };

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async e => {
    e.preventDefault();
    try {
      if (editing) {
        await updateProperty(
          editing,
          form,
          form.imageFiles,
          (idx, pct) =>
            setUploadProgress(p => ({ ...p, [idx]: pct }))
        );
        await confirmAlert({ title: 'Updated', text: 'Property updated', icon: 'success' });
      } else {
        await createProperty(
          { ...form },
          form.imageFiles,
          (idx, pct) =>
            setUploadProgress(p => ({ ...p, [idx]: pct }))
        );
        await confirmAlert({ title: 'Created', text: 'Property created', icon: 'success' });
      }
      openForm(null);
    } catch (err) {
      await confirmAlert({ title: 'Error', text: err.message, icon: 'error' });
    }
  };

  const onDelete = async prop => {
    const ok = await confirmAlert({
      title: 'Delete?',
      text: prop.title,
      icon: 'warning',
      showCancelButton: true
    });
    if (ok) {
      await deleteProperty(prop.id);
      await confirmAlert({ title: 'Deleted', text: 'Property removed', icon: 'success' });
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100">
      <button onClick={() => openForm(null)} className="mb-4 px-4 py-2 bg-blue-600 rounded">
        + New Property
      </button>

      {props.map(p => (
        <div key={p.id} className="flex justify-between bg-gray-700 p-4 mb-2 rounded">
          <div>{p.title}</div>
          <div className="space-x-2">
            <button onClick={() => openForm(p)} className="px-2 bg-yellow-600 rounded">Edit</button>
            <button onClick={() => onDelete(p)} className="px-2 bg-red-600 rounded">Delete</button>
          </div>
        </div>
      ))}

      {/* Form */}
      <form onSubmit={onSubmit} className="mt-6 space-y-4 bg-gray-900 p-4 rounded">
        <input name="title" placeholder="Title" onChange={handleChange}
               value={form.title} className="w-full p-2 bg-gray-800 rounded" />

        <input name="price" type="number" placeholder="Price"
               onChange={handleChange} value={form.price}
               className="w-full p-2 bg-gray-800 rounded" />

        <input name="area" type="number" placeholder="Area (sqft)"
               onChange={handleChange} value={form.area}
               className="w-full p-2 bg-gray-800 rounded" />

        <select name="size" onChange={handleChange} value={form.size}
                className="w-full p-2 bg-gray-800 rounded">
          {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} BHK</option>)}
        </select>

        <select name="status" onChange={handleChange} value={form.status}
                className="w-full p-2 bg-gray-800 rounded">
          {['available','offer','booked','sold'].map(s =>
            <option key={s} value={s}>{s}</option>
          )}
        </select>

        <input name="address" placeholder="Address"
               onChange={handleChange} value={form.address}
               className="w-full p-2 bg-gray-800 rounded" />

        <textarea name="description" rows={3} placeholder="Description"
                  onChange={handleChange} value={form.description}
                  className="w-full p-2 bg-gray-800 rounded" />

        <div>
          <label className="block mb-1">Images</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {Object.entries(uploadProgress).map(([i, pct]) => (
          <div key={i}>{`Image ${i}: ${pct.toFixed(0)}%`}</div>
        ))}

        <button type="submit" className="px-4 py-2 bg-green-600 rounded">
          {editing ? 'Update' : 'Create'}
        </button>
      </form>
    </div>
  );
}