import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

import { Link } from 'react-router-dom'

type Bicycle = {
  id: string
  bike_code: string
  brand: string | null
  model: string | null
  status: string
  purchase_price: number
}

function Bicycles() {
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadBicycles() {
      const { data, error } = await supabase
        .from('bicycles')
        .select('id, bike_code, brand, model, status, purchase_price')
        .order('created_at', { ascending: false })

      if (error) {
        console.error(error)
        setErrorMessage(error.message)
      } else {
        setBicycles(data ?? [])
      }

      setLoading(false)
    }

    loadBicycles()
  }, [])

  if (loading) {
    return <p>Loading bicycles...</p>
  }

  if (errorMessage) {
    return <p>Error: {errorMessage}</p>
  }

  return (
    <div>
      <h1>Bicycles</h1>
      <Link to="/bicycles/add">
        + Add Bicycle
      </Link>

      {bicycles.length === 0 ? (
        <p>No bicycles added yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Bike Code</th>
              <th>Brand</th>
              <th>Model</th>
              <th>Status</th>
              <th>Purchase Price</th>
            </tr>
          </thead>

          <tbody>
            {bicycles.map((bike) => (
              <tr key={bike.id}>
                <td>{bike.bike_code}</td>
                <td>{bike.brand ?? '-'}</td>
                <td>{bike.model ?? '-'}</td>
                <td>{bike.status}</td>
                <td>${bike.purchase_price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

export default Bicycles