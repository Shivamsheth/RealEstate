import React from 'react'

export default function Privacy() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-16">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-4">Privacy Policy</h1>
        <p className="leading-relaxed text-gray-300">
          Your privacy is important to us. We collect and use personal
          information only as described below...
        </p>
        {/* Expand with sections on data collection, cookies, etc. */}
      </main>
    </div>
  )
}