'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: '📊',
      title: 'Dashboard Interactif',
      description: 'Visualisez vos projets avec des graphiques en temps réel',
      stats: '15+ types de graphiques',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🤖',
      title: 'Assistant IA',
      description: 'Génération automatique de tâches et recommandations intelligentes',
      stats: 'Alimenté par GPT-4',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '👥',
      title: 'Collaboration',
      description: 'Chat intégré, mentions et notifications en temps réel',
      stats: 'Collaboration temps réel',
      color: 'from-green-500 to-emerald-500'
    }
  ]

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-8">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Project Manager AI
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Plateforme de gestion de projets collaboratifs avec intelligence artificielle
            </p>
          </div>
          
          <div className="flex gap-4 justify-center mt-8">
            <Link href="/auth/login">
              <Button size="lg" className="text-lg hover:scale-105 transition-transform">
                Se connecter
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="text-lg hover:scale-105 transition-transform">
                Créer un compte
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className={`p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer transform transition-all duration-300 hover:shadow-2xl ${
                  hoveredCard === idx ? 'scale-105 -translate-y-2' : ''
                }`}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="text-5xl mb-4 transition-transform duration-300 hover:scale-110">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  {feature.description}
                </p>
                {hoveredCard === idx && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span className={`text-sm font-medium bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}>
                      {feature.stats}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Additional Info Section */}
          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">500+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Projets créés</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400">10K+</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Tâches gérées</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400">98%</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Satisfaction client</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-orange-600 dark:text-orange-400">24/7</div>
              <p className="text-gray-600 dark:text-gray-400 mt-2">Support disponible</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
