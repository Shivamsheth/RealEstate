import React from 'react'
import { useFirestoreCollection } from '../hooks/useFirestoreCollection'
import { where } from 'firebase/firestore'
import Spinner from '../components/Common/Spinner'
import { motion } from 'framer-motion'

export default function Agents() {
  const { data: agents, loading } = useFirestoreCollection(
    'users',
    [where('role', '==', 'agent')]
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen pt-16">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-semibold mb-6">Our Agents</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map(agent => (
            <motion.div
              key={agent.uid}
              whileHover={{ scale: 1.03 }}
              className="bg-gray-800 p-6 rounded-lg shadow"
            >
              <p className="text-lg font-medium">{agent.email}</p>
              <p className="mt-1 text-sm text-gray-400">Licensed Agent</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}