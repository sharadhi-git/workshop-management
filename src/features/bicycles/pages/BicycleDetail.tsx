
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import './BicycleDetail.css'

type Bicycle = {
  id: string
  bike_code: string
  brand: string | null
  model: string | null
  bike_type: string | null
  colour: string | null
  frame_size: string | null
  wheel_size: string | null
  purchase_date: string | null
  purchase_price: number
  pickup_location: string | null
  condition_notes: string | null
  status: string
  advertised_date: string | null
  advertised_price: number | null
}

function BicycleDetail() {
  const { bikeCode } = useParams()

  const [bike, setBike] = useState<Bicycle | null>(null)
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    async function loadBicycle() {
      if (!bikeCode) {
        setErrorMessage('Bike code not found.')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('bicycles')
        .select(`
          id,
          bike_code,
          brand,
          model,
          bike_type,
          colour,
          frame_size,
          wheel_size,
          purchase_date,
          purchase_price,
          pickup_location,
          condition_notes,
          status,
          advertised_date,
          advertised_price
        `)
        .eq('bike_code', bikeCode)
        .single()

      if (error) {
        console.error(error)
        setErrorMessage(error.message)
      } else {
        setBike(data)
      }

      setLoading(false)
    }

    loadBicycle()
  }, [bikeCode])

  function formatMoney(value: number | null) {
    if (value === null) return '—'

    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value)
  }

  function formatDate(value: string | null) {
    if (!value) return '—'

    return new Date(value).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return <div className="bike-detail-page">Loading bicycle...</div>
  }

  if (errorMessage || !bike) {
    return (
      <div className="bike-detail-page">
        <Link to="/bicycles">← Back to Bicycles</Link>
        <p>Error: {errorMessage || 'Bicycle not found.'}</p>
      </div>
    )
  }

  return (
    <div className="bike-detail-page">
      <Link to="/bicycles" className="back-link">
        ← Back to Bicycles
      </Link>

      <div className="bike-detail-header">
        <div>
          <span className="bike-detail-code">{bike.bike_code}</span>

          <h1>
            {bike.brand ?? 'Unknown Brand'}
            {bike.model ? ` ${bike.model}` : ''}
          </h1>
        </div>

        <span
          className={`status-badge status-${bike.status.toLowerCase()}`}
        >
          {bike.status.replaceAll('_', ' ')}
        </span>
      </div>

      <div className="bike-detail-card">
        <h2>Bicycle Details</h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Brand</span>
            <strong>{bike.brand ?? '—'}</strong>
          </div>

          <div>
            <span className="detail-label">Model</span>
            <strong>{bike.model ?? '—'}</strong>
          </div>

          <div>
            <span className="detail-label">Type</span>
            <strong>{bike.bike_type ?? '—'}</strong>
          </div>

          <div>
            <span className="detail-label">Colour</span>
            <strong>{bike.colour ?? '—'}</strong>
          </div>

          <div>
            <span className="detail-label">Frame Size</span>
            <strong>{bike.frame_size ?? '—'}</strong>
          </div>

          <div>
            <span className="detail-label">Wheel Size</span>
            <strong>{bike.wheel_size ?? '—'}</strong>
          </div>
        </div>
      </div>

      <div className="bike-detail-card">
        <h2>Purchase</h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Purchase Date</span>
            <strong>{formatDate(bike.purchase_date)}</strong>
          </div>

          <div>
            <span className="detail-label">Purchase Price</span>
            <strong>{formatMoney(bike.purchase_price)}</strong>
          </div>

          <div>
            <span className="detail-label">Pickup Location</span>
            <strong>{bike.pickup_location ?? '—'}</strong>
          </div>
        </div>
      </div>

      <div className="bike-detail-card">
        <h2>Condition Notes</h2>
        <p>{bike.condition_notes ?? 'No notes recorded.'}</p>
      </div>

      <div className="bike-detail-card">
        <h2>Advertising</h2>

        <div className="detail-grid">
          <div>
            <span className="detail-label">Advertised Date</span>
            <strong>{formatDate(bike.advertised_date)}</strong>
          </div>

          <div>
            <span className="detail-label">Advertised Price</span>
            <strong>{formatMoney(bike.advertised_price)}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BicycleDetail