import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { Navigate, Route, Routes } from 'react-router-dom'

import {supabase} from '../lib/supabase'
import Login from '../features/Auth/pages/Login'
import Dashboard from '../features/dashboard/pages/Dashboard'
import Bicycles from '../features/bicycles/pages/Bicycles'
import AddBicycle from '../features/bicycles/pages/AddBicycle'
import './App.css' // Import the CSS file for styling


function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getInitialSession() {
      const { data } = await supabase.auth.getSession()

      setSession(data.session)
      setLoading(false)
    }

    getInitialSession()

    const { data } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )
    return () => {
      data.subscription.unsubscribe()
    }
  }, [])

  if (loading) {
    return <p>Loading...</p>
  }

  if (!session) {
    return <Login />
  }

  return (
  <Routes>
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/bicycles" element={<Bicycles />} />
    <Route path="/bicycles/add" element={<AddBicycle />} />
    <Route
        path="*"
        element={<Navigate to="/dashboard" replace />} />
  </Routes>
  
)
}

export default App

