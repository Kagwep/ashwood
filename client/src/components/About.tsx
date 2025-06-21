import React, { useState } from 'react';

const AshwoodAbout = () => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = {
    overview: {
      title: "🏛️ Game Overview",
      content: (
        <div className="space-y-6">
          <div className="text-lg text-amber-200 leading-relaxed">
            <p className="mb-4">
              Ashwood is a revolutionary blockchain-based tactical strategy game built on Starknet using the Dojo framework. 
              Command diverse armies across a dynamic 54-position battlefield where strategic positioning, seasonal warfare, 
              and supply chain management determine victory.
            </p>
            <p className="mb-4">
              In the realm of Ashwood, you are a legendary commander tasked with deploying forces across six interconnected 
              battlefields. Each unit class—from steadfast Infantry to swift Cavalry, precise Archers to elite formations—
              brings unique tactical advantages that shift with the changing seasons.
            </p>
            <p>
              Master the art of war through careful unit positioning, supply line management, and adaptive strategies 
              that respond to dynamic battlefield conditions. Every deployment decision echoes across the realm, 
              shaping the fate of kingdoms through tactical brilliance.
            </p>
          </div>
        </div>
      )
    },
    battlefield: {
      title: "⚔️ Battlefield System",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50">
              <h4 className="text-xl font-bold text-amber-300 mb-3">🏰 Tactical Grid</h4>
              <ul className="text-amber-200 space-y-2 text-sm">
                <li>• 54-position strategic battlefield</li>
                <li>• 6 interconnected combat zones</li>
                <li>• 3x3 formation grids</li>
                <li>• Dynamic position availability</li>
              </ul>
            </div>
            <div className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50">
              <h4 className="text-xl font-bold text-amber-300 mb-3">🔗 Supply Chains</h4>
              <ul className="text-amber-200 space-y-2 text-sm">
                <li>• Adjacent unit connections</li>
                <li>• Strategic deployment rules</li>
                <li>• Middle position control</li>
                <li>• Formation maintenance</li>
              </ul>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-6 gap-2 p-4 bg-amber-900/30 rounded-lg border border-amber-600/30">
              {[...Array(18)].map((_, i) => (
                <div key={i} 
                     className="w-8 h-8 bg-amber-700/40 border border-amber-500 
                               rounded flex items-center justify-center text-xs
                               hover:scale-110 transition-transform duration-200">
                  {i % 6 === 0 ? '🛡️' : i % 6 === 1 ? '⚔️' : i % 6 === 2 ? '🏹' : i % 6 === 3 ? '🐎' : i % 6 === 4 ? '🔱' : '⭐'}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    units: {
      title: "🪖 Army Units",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🛡️", name: "Infantry", movement: "1 tile orthogonal", role: "Versatile foot soldiers", specialty: "Steady in most seasons" },
              { icon: "🔱", name: "Pike", movement: "1 tile forward only", role: "Spear formation units", specialty: "Winter defensive powerhouse" },
              { icon: "🏹", name: "Archer", movement: "1 tile orthogonal", role: "Ranged combat specialists", specialty: "Summer dominance" },
              { icon: "🐎", name: "Cavalry", movement: "2 tiles orthogonal", role: "Fast strike force", specialty: "Summer power, winter weakness" },
              { icon: "⭐", name: "Elite", movement: "1-2 tiles any direction", role: "Versatile hero units", specialty: "All-season adaptability" },
              { icon: "🏴", name: "Support", movement: "1 tile any direction", role: "Battlefield assistance", specialty: "Essential in harsh conditions" }
            ].map((unit, index) => (
              <div key={index} className="bg-amber-900/40 rounded-lg p-4 border border-amber-600/50 hover:scale-105 transition-transform duration-200">
                <div className="text-center mb-3">
                  <div className="text-3xl mb-2">{unit.icon}</div>
                  <h4 className="text-lg font-bold text-amber-300">{unit.name}</h4>
                </div>
                <div className="space-y-2 text-amber-200 text-sm">
                  <p><strong>Movement:</strong> {unit.movement}</p>
                  <p><strong>Role:</strong> {unit.role}</p>
                  <p><strong>Specialty:</strong> {unit.specialty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    seasons: {
      title: "🌦️ Seasonal Warfare",
      content: (
        <div className="space-y-6">
          <div className="text-amber-200 text-lg mb-6">
            The battlefield transforms with the seasons, unlocking different strategic opportunities and challenges.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-blue-900/30 rounded-lg p-6 border-2 border-blue-500/50">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">❄️</div>
                <h4 className="text-xl font-bold text-blue-300">Winter</h4>
                <p className="text-blue-200 text-sm">Odd Positions</p>
              </div>
              <div className="space-y-2 text-blue-100 text-sm">
                <p>• Pike formations gain +3 defense</p>
                <p>• Cavalry severely limited</p>
                <p>• Infantry movement reduced</p>
                <p>• Support units become crucial</p>
              </div>
            </div>
            <div className="bg-yellow-900/30 rounded-lg p-6 border-2 border-yellow-500/50">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">☀️</div>
                <h4 className="text-xl font-bold text-yellow-300">Summer</h4>
                <p className="text-yellow-200 text-sm">Even Positions</p>
              </div>
              <div className="space-y-2 text-yellow-100 text-sm">
                <p>• Archers gain +3 attack</p>
                <p>• Cavalry at peak performance</p>
                <p>• Elite units excel</p>
                <p>• Fast-paced warfare</p>
              </div>
            </div>
            <div className="bg-orange-900/30 rounded-lg p-6 border-2 border-orange-500/50">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">🍂</div>
                <h4 className="text-xl font-bold text-orange-300">Autumn</h4>
                <p className="text-orange-200 text-sm">Prime Positions</p>
              </div>
              <div className="space-y-2 text-orange-100 text-sm">
                <p>• Elite units gain +2 special</p>
                <p>• Muddy terrain challenges</p>
                <p>• Strategic positioning key</p>
                <p>• Tactical complexity peaks</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    technology: {
      title: "⚡ Blockchain Technology",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-amber-900/40 rounded-lg p-6 border border-amber-600/50">
              <h4 className="text-xl font-bold text-amber-300 mb-4">🏗️ Built on Starknet</h4>
              <ul className="text-amber-200 space-y-2 text-sm">
                <li>• Zero-knowledge proof technology</li>
                <li>• Low transaction costs</li>
                <li>• High throughput gaming</li>
                <li>• Ethereum security</li>
              </ul>
            </div>
            <div className="bg-amber-900/40 rounded-lg p-6 border border-amber-600/50">
              <h4 className="text-xl font-bold text-amber-300 mb-4">🎯 Dojo Framework</h4>
              <ul className="text-amber-200 space-y-2 text-sm">
                <li>• Entity Component System</li>
                <li>• Provable game state</li>
                <li>• Modular architecture</li>
                <li>• Developer-friendly tools</li>
              </ul>
            </div>
          </div>
          <div className="bg-green-900/30 rounded-lg p-6 border-2 border-green-500/50">
            <h4 className="text-xl font-bold text-green-300 mb-4">🌟 Key Benefits</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-green-100 text-sm">
              <div>
                <p className="font-semibold mb-2">For Players:</p>
                <ul className="space-y-1">
                  <li>• True asset ownership</li>
                  <li>• Transparent game mechanics</li>
                  <li>• Persistent game state</li>
                  <li>• Cross-platform compatibility</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-2">For the Ecosystem:</p>
                <ul className="space-y-1">
                  <li>• Decentralized governance</li>
                  <li>• Community-driven development</li>
                  <li>• Interoperable game assets</li>
                  <li>• Open-source innovation</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-amber-50">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 20% 30%, rgba(245, 158, 11, 0.4) 0%, transparent 50%),
                                radial-gradient(circle at 80% 70%, rgba(245, 158, 11, 0.3) 0%, transparent 50%),
                                radial-gradient(circle at 50% 50%, rgba(245, 158, 11, 0.2) 0%, transparent 70%)`
             }} />
      </div>

      {/* Floating Combat Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 text-5xl text-amber-600/15 animate-bounce">⚔️</div>
        <div className="absolute top-40 right-32 text-4xl text-amber-500/20 animate-pulse">🛡️</div>
        <div className="absolute bottom-32 left-40 text-6xl text-amber-700/15 animate-ping">🏰</div>
        <div className="absolute bottom-20 right-20 text-3xl text-amber-600/15 animate-bounce">🐎</div>
        <div className="absolute top-60 left-1/3 text-4xl text-amber-500/10 animate-pulse">🏹</div>
        <div className="absolute top-80 right-1/4 text-5xl text-amber-700/15 animate-ping">⭐</div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-amber-300 mb-4 tracking-wider"
              style={{
                fontFamily: 'serif',
                textShadow: '0 0 30px rgba(245, 158, 11, 0.5)'
              }}>
            ASHWOOD
          </h1>
          <p className="text-xl text-amber-200 font-medium">
            A Tactical Strategy Onchain Game
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 border-2 ${
                activeSection === key
                  ? 'bg-amber-700 border-amber-500 text-amber-100 shadow-lg'
                  : 'bg-amber-900/50 border-amber-600/50 text-amber-300 hover:bg-amber-800/50'
              }`}
            >
              {section.title}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-amber-900/60 to-amber-800/60 border-2 border-amber-600 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
          <h2 className="text-3xl font-bold text-amber-300 mb-6 text-center">
            {sections[activeSection].title}
          </h2>
          {sections[activeSection].content}
        </div>

        {/* Footer */}
        <div className="text-center mt-12">
          <div className="flex justify-center items-center gap-8 mb-6">
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-2xl">⚔️</span>
              <span className="font-medium">TACTICAL</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-2xl">🏰</span>
              <span className="font-medium">STRATEGIC</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <span className="text-2xl">⚡</span>
              <span className="font-medium">ONCHAIN</span>
            </div>
          </div>
          <p className="text-amber-300/70 text-sm">
            Built with ⚔️ for tactical strategy enthusiasts and blockchain gamers
          </p>
        </div>
      </div>
    </div>
  );
};

export default AshwoodAbout;