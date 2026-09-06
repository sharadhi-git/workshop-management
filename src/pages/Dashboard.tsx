import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function Dashboard() {
  const [bikeCount, setBikeCount] = useState<number | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadBicycles() {
      const { data, error } = await supabase
        .from('bicycles')
        .select('id')

      if (error) {
        console.error(error)
        setErrorMessage(error.message)
        return
      }

      setBikeCount(data.length)
    }

    loadBicycles()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  return (
    <div>
      <h1>Bicycle Workshop Management</h1>
      <h2>Dashboard</h2>

      {errorMessage ? (
        <p>Database error: {errorMessage}</p>
      ) : (
        <p>Bicycles in database: {bikeCount ?? 'Loading...'}</p>
      )}

      <button onClick={handleLogout}>
        Sign out
      </button>
    </div>
  )
}

export default Dashboard