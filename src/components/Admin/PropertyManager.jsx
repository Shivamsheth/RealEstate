import React, { useState, useEffect } from 'react';
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
    images: [],
  });
  const [uploadProgress, setUploadProgress] = useState({});

  useEffect(() => {
    return () => {
      form.imageFiles.forEach(file => URL.revokeObjectURL(file));
    };
  }, [form.imageFiles]);

  if (loading) return <Spinner />;

  const openForm = (prop) => {
    if (prop) {
      setEditing(prop.id);
      setForm({
        ...prop,
        imageFiles: [],
        images: prop.images || [],
      });
    } else {
      setEditing(null);
      setForm({
        title: '',
        price: 0,
        area: 0,
        size: 1,
        status: 'available',
        address: '',
        description: '',
        imageFiles: [],
        images: [],
      });
    }
    setUploadProgress({});
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setForm((f) => ({
      ...f,
      imageFiles: files,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.price || !form.address) {
      await confirmAlert({
        title: 'Missing Fields',
        text: 'Please fill in title, price, and address.',
        icon: 'warning',
      });
      return;
    }

    try {
      if (editing) {
        await updateProperty(
          editing,
          form,
          form.imageFiles,
          (idx, pct) =>
            setUploadProgress((p) => ({ ...p, [idx]: pct }))
        );
        await confirmAlert({
          title: 'Updated',
          text: 'Property updated successfully',
          icon: 'success',
        });
      } else {
        await createProperty(
          { ...form },
          form.imageFiles,
          (idx, pct) =>
            setUploadProgress((p) => ({ ...p, [idx]: pct }))
        );
        await confirmAlert({
          title: 'Created',
          text: 'Property created successfully',
          icon: 'success',
        });
      }
      openForm(null);
    } catch (err) {
      await confirmAlert({
        title: 'Error',
        text: err.message,
        icon: 'error',
      });
    }
  };

  const onDelete = async (prop) => {
    const ok = await confirmAlert({
      title: 'Delete?',
      text: prop.title,
      icon: 'warning',
      showCancelButton: true,
    });
    if (ok) {
      await deleteProperty(prop.id);
      await confirmAlert({
        title: 'Deleted',
        text: 'Property removed',
        icon: 'success',
      });
    }
  };

  return (
    <div className="p-6 bg-gray-800 text-gray-100">
      <button
        onClick={() => openForm(null)}
        className="mb-4 px-4 py-2 bg-blue-600 rounded"
      >
        + New Property
      </button>

      {props.map((p) => (
        <div
          key={p.id}
          className="flex justify-between items-center bg-gray-700 p-4 mb-2 rounded"
        >
          <div>
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-gray-400">{p.address}</div>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => openForm(p)}
              className="px-2 py-1 bg-yellow-600 rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(p)}
              className="px-2 py-1 bg-red-600 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="mt-6 space-y-4 bg-gray-900 p-6 rounded shadow-lg"
      >
        <h2 className="text-xl font-semibold mb-2">
          {editing ? 'Edit Property' : 'Add New Property'}
        </h2>

        <input
          name="title"
          placeholder="Title"
          onChange={handleChange}
          value={form.title}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          onChange={handleChange}
          value={form.price}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <input
          name="area"
          type="number"
          placeholder="Area (sqft)"
          onChange={handleChange}
          value={form.area}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <select
          name="size"
          onChange={handleChange}
          value={form.size}
          className="w-full p-2 bg-gray-800 rounded"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} BHK
            </option>
          ))}
        </select>

        <select
          name="status"
          onChange={handleChange}
          value={form.status}
          className="w-full p-2 bg-gray-800 rounded"
        >
          {['available', 'offer', 'booked', 'sold'].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          value={form.address}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <textarea
          name="description"
          rows={3}
          placeholder="Description"
          onChange={handleChange}
          value={form.description}
          className="w-full p-2 bg-gray-800 rounded"
        />

        <div>
          <label className="block mb-1 font-medium">Upload Images</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300"
          />
        </div>

        {/* New Image Previews */}
        {form.imageFiles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
            {form.imageFiles.map((file, idx) => (
              <div key={idx} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
                {uploadProgress[idx] && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs text-center py-1">
                    {uploadProgress[idx].toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Existing Images */}
        {form.images.length > 0 && (
          <div className="mt-4">
            <label className="block mb-1 font-medium">Existing Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.images.map((url, idx) => (
                <img
                  key={idx}
                  src={url}
                  alt={`Uploaded ${idx}`}
                  className="w-full h-32 object-cover rounded"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
        >
          {editing ? 'Update Property' : 'Create Property'}
        </button>
      </form>
    </div>
  );
}