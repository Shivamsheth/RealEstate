import React from 'react'

const faqs = [
  {
    q: 'How do I schedule a visit?',
    a: 'On any property page, fill out the appointment form under "Schedule".'
  },
  {
    q: 'Can I edit or cancel appointments?',
    a: 'Yes—visit your dashboard to manage upcoming appointments.'
  },
  {
    q: 'How do I list my property?',
    a: 'Contact us using the form above, and an agent will reach out.'
  }
]

export default function FAQ() {
  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-16">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <div key={i} className="bg-gray-800 p-4 rounded">
              <h2 className="font-medium">{item.q}</h2>
              <p className="mt-1 text-gray-300">{item.a}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}