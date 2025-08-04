import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import DraftBoard from './components/DraftBoard'
import PlayerSearch from './components/PlayerSearch'
import TeamRoster from './components/TeamRoster'
import Settings from './components/Settings'
import Navigation from './components/Navigation'
import { DraftProvider } from './context/DraftContext'

function App() {
  return (
    <DraftProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="py-6">
              <h1 className="text-3xl font-bold text-nfl-blue text-center">
                Fantasy NFL Draft Assistant
              </h1>
            </header>
            
            <main className="pb-20">
              <Routes>
                <Route path="/" element={<DraftBoard />} />
                <Route path="/search" element={<PlayerSearch />} />
                <Route path="/roster" element={<TeamRoster />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
            
            <Navigation />
          </div>
        </div>
      </Router>
    </DraftProvider>
  )
}

export default App