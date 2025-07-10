import React, { useState } from 'react'
import { confirmAlert } from '../services/alertService'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    // TODO: wire up email/send logic
    await confirmAlert({
      title: 'Message Sent',
      text: 'Thank you for contacting us. We’ll get back shortly.',
      icon: 'success'
    })
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-16">
      <main className="container mx-auto px-4 py-8 max-w-lg">
        <h1 className="text-3xl font-semibold mb-6">Contact Us</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-gray-300">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </div>
          <div>
            <label className="block mb-1 text-gray-300">Message</label>
            <textarea
              name="message"
              rows="5"
              value={form.message}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded text-gray-100"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded"
          >
            Send Message
          </button>
        </form>
      </main>
    </div>
  )
}