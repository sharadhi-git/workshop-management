import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'
import './Bicycles.css'

type Sale = {
  sale_price: number
  sale_date: string
}

type Bicycle = {
  id: string
  bike_code: string
  brand: string | null
  model: string | null
  bike_type: string | null
  wheel_size: string | null
  purchase_date: string | null
  purchase_price: number
  status: string
  sales: Sale | Sale[] | null
}

function Bicycles() {
  const [bicycles, setBicycles] = useState<Bicycle[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  const [search, setSearch] = useState('')
  const [view, setView] = useState<'ACTIVE' | 'ALL' | 'SOLD'>('ACTIVE')
  const [sortBy, setSortBy] = useState('newest')

  useEffect(() => {
    async function loadBicycles() {
      const { data, error } = await supabase
        .from('bicycles')
        .select(`
          id,
          bike_code,
          brand,
          model,
          bike_type,
          wheel_size,
          purchase_date,
          purchase_price,
          status,
          sales (
            sale_price,
            sale_date
          )
        `)

      if (error) {
        console.error(error)
        setErrorMessage(error.message)
      } else {
        setBicycles((data ?? []) as Bicycle[])
      }

      setLoading(false)
    }

    loadBicycles()
  }, [])

  function getSale(bike: Bicycle) {
    if (!bike.sales) return null

    if (Array.isArray(bike.sales)) {
      return bike.sales[0] ?? null
    }

    return bike.sales
  }

  const filteredBicycles = useMemo(() => {
    let result = [...bicycles]

    if (view === 'ACTIVE') {
      result = result.filter((bike) => bike.status !== 'SOLD')
    }

    if (view === 'SOLD') {
      result = result.filter((bike) => bike.status === 'SOLD')
    }

    const searchText = search.trim().toLowerCase()

    if (searchText) {
      result = result.filter((bike) =>
        [
          bike.bike_code,
          bike.brand,
          bike.model,
        ].some((value) =>
          value?.toLowerCase().includes(searchText)
        )
      )
    }

    result.sort((a, b) => {
      if (sortBy === 'oldest') {
        return (
          new Date(a.purchase_date ?? 0).getTime() -
          new Date(b.purchase_date ?? 0).getTime()
        )
      }

      if (sortBy === 'price-high') {
        return b.purchase_price - a.purchase_price
      }

      if (sortBy === 'price-low') {
        return a.purchase_price - b.purchase_price
      }

      if (sortBy === 'code') {
        return a.bike_code.localeCompare(b.bike_code)
      }

      // newest
      return (
        new Date(b.purchase_date ?? 0).getTime() -
        new Date(a.purchase_date ?? 0).getTime()
      )
    })

    return result
  }, [bicycles, search, view, sortBy])

  function formatMoney(value: number | null) {
    if (value === null) return '—'

    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
    }).format(value)
  }

  function formatDate(date: string | null) {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-AU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading) {
    return <div className="bicycles-page">Loading bicycles...</div>
  }

  if (errorMessage) {
    return (
      <div className="bicycles-page">
        <p className="bicycle-error">
          Error: {errorMessage}
        </p>
      </div>
    )
  }

  return (
    <div className="bicycles-page">
      <div className="bicycles-header">
        <div>
          <h1>Bicycles</h1>
          <p>Manage purchased, serviced and sold bicycles.</p>
        </div>

        <Link to="/bicycles/add" className="add-bike-button">
          + Add Bicycle
        </Link>
      </div>

      <div className="bicycle-toolbar">
        <input
          className="bicycle-search"
          type="text"
          placeholder="Search bike code, brand or model..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="bicycle-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Newest purchased</option>
          <option value="oldest">Oldest purchased</option>
          <option value="code">Bike code</option>
          <option value="price-high">Highest purchase price</option>
          <option value="price-low">Lowest purchase price</option>
        </select>
      </div>

      <div className="bicycle-filters">
        <button
          className={view === 'ACTIVE' ? 'active' : ''}
          onClick={() => setView('ACTIVE')}
        >
          Active
        </button>

        <button
          className={view === 'ALL' ? 'active' : ''}
          onClick={() => setView('ALL')}
        >
          All
        </button>

        <button
          className={view === 'SOLD' ? 'active' : ''}
          onClick={() => setView('SOLD')}
        >
          Sold
        </button>
      </div>

      {filteredBicycles.length === 0 ? (
        <div className="empty-bicycles">
          No bicycles found.
        </div>
      ) : (
        <>
          {/* DESKTOP */}
          <div className="bicycle-table-wrapper">
            <table className="bicycle-table">
              <thead>
                <tr>
                  <th>Bike Code</th>
                  <th>Bicycle</th>
                  <th>Type</th>
                  <th>Purchase Date</th>
                  <th>Purchase Price</th>
                  <th>Status</th>
                  <th>Sale Price</th>
                  <th>Sale Date</th>
                </tr>
              </thead>

              <tbody>
                {filteredBicycles.map((bike) => (
                  <tr key={bike.id}>
                    <td className="bike-code">
                      {bike.bike_code}
                    </td>

                    <td>
                      <strong>
                        {bike.brand ?? 'Unknown'}
                        {bike.model ? ` ${bike.model}` : ''}
                      </strong>
                    </td>

                    <td>{bike.bike_type ?? '—'}</td>

                    <td>{formatDate(bike.purchase_date)}</td>

                    <td>
                      {formatMoney(bike.purchase_price)}
                    </td>

                    <td>
                      <span
                        className={`status-badge status-${bike.status.toLowerCase()}`}
                      >
                        {bike.status.replaceAll('_', ' ')}
                      </span>
                    </td>
                    <td>
                      {getSale(bike)
                        ? formatDate(getSale(bike)!.sale_date)
                        : '—'}
                    </td>

                    <td>
                      {getSale(bike)
                        ? formatMoney(getSale(bike)!.sale_price)
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* MOBILE */}
          <div className="bicycle-card-list">
            {filteredBicycles.map((bike) => (
              <div className="bicycle-card" key={bike.id}>
                <div className="bicycle-card-header">
                  <strong>{bike.bike_code}</strong>

                  <span
                    className={`status-badge status-${bike.status.toLowerCase()}`}
                  >
                    {bike.status.replaceAll('_', ' ')}
                  </span>
                </div>

                <h3>
                  {bike.brand ?? 'Unknown'}
                  {bike.model ? ` ${bike.model}` : ''}
                </h3>

                <p>
                  {bike.bike_type ?? 'Unknown type'}
                  {bike.wheel_size
                    ? ` • ${bike.wheel_size}`
                    : ''}
                </p>

                <div className="bicycle-card-finance">
                  <span>
                    Purchased: {formatMoney(bike.purchase_price)}
                  </span>

                  {getSale(bike) && (
                    <div className="bicycle-sale-info">
                      <span>
                        Sold: {formatMoney(getSale(bike)!.sale_price)}
                      </span>

                      <span>
                        {formatDate(getSale(bike)!.sale_date)}
                      </span>
                    </div>
                  )}
                </div>

                <small>
                  Purchased {formatDate(bike.purchase_date)}
                </small>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default Bicycles