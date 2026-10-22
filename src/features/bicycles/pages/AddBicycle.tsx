import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabase'


function AddBicycle() {
  const navigate = useNavigate()

  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [bikeType, setBikeType] = useState('')
  const [colour, setColour] = useState('')
  const [frameSize, setFrameSize] = useState('')
  const [wheelSize, setWheelSize] = useState('')
  const [purchasePrice, setPurchasePrice] = useState('')
  const [purchaseSource, setPurchaseSource] = useState('')
  const [pickupLocation, setPickupLocation] = useState('')
  const [conditionNotes, setConditionNotes] = useState('')

  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    setSaving(true)
    setErrorMessage('')

    const { error } = await supabase
      .from('bicycles')
      .insert({
        brand: brand || null,
        model: model || null,
        bike_type: bikeType || null,
        colour: colour || null,
        frame_size: frameSize || null,
        wheel_size: wheelSize || null,
        purchase_price: Number(purchasePrice),
        purchase_source: purchaseSource || null,
        pickup_location: pickupLocation || null,
        condition_notes: conditionNotes || null,
      })

    if (error) {
      console.error(error)
      setErrorMessage(error.message)
      setSaving(false)
      return
    }

    navigate('/bicycles')
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">Add Bicycle</h1>
        <p className="page-subtitle">
          Enter the purchase details for a newly acquired bicycle.
        </p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-row">
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="e.g. Giant"
            />
          </div>

          <div className="form-row">
            <label htmlFor="model">Model</label>
            <input
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="e.g. Talon 3"
            />
          </div>

          <div className="form-row">
            <label htmlFor="bikeType">Bike Type</label>
            <input
              id="bikeType"
              value={bikeType}
              onChange={(e) => setBikeType(e.target.value)}
              placeholder="e.g. Mountain Bike"
            />
          </div>

          <div className="form-row">
            <label htmlFor="colour">Colour</label>
            <input
              id="colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
              placeholder="e.g. Black"
            />
          </div>

          <div className="form-row">
            <label htmlFor="frameSize">Frame Size</label>
            <input
              id="frameSize"
              value={frameSize}
              onChange={(e) => setFrameSize(e.target.value)}
              placeholder="e.g. Medium"
            />
          </div>

          <div className="form-row">
            <label htmlFor="wheelSize">Wheel Size</label>
            <input
              id="wheelSize"
              value={wheelSize}
              onChange={(e) => setWheelSize(e.target.value)}
              placeholder="e.g. 29 inch"
            />
          </div>

          <div className="form-row">
            <label htmlFor="purchasePrice">Purchase Price</label>
            <input
              id="purchasePrice"
              type="number"
              step="0.01"
              min="0"
              value={purchasePrice}
              onChange={(e) => setPurchasePrice(e.target.value)}
              placeholder="e.g. 180"
              required
            />
          </div>

          <div className="form-row">
            <label htmlFor="purchaseSource">Purchase Source</label>
            <input
              id="purchaseSource"
              value={purchaseSource}
              onChange={(e) => setPurchaseSource(e.target.value)}
              placeholder="e.g. Facebook Marketplace"
            />
          </div>

          <div className="form-row">
            <label htmlFor="pickupLocation">Pickup Location</label>
            <input
              id="pickupLocation"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Berwick"
            />
          </div>

          <div className="form-row">
            <label htmlFor="conditionNotes">Condition Notes</label>
            <textarea
              id="conditionNotes"
              value={conditionNotes}
              onChange={(e) => setConditionNotes(e.target.value)}
              placeholder="Optional notes about the bicycle condition"
            />
          </div>

          <div className="form-actions">
            <Link to="/bicycles" className="link-button">
              Cancel
            </Link>

            <button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Add Bicycle'}
            </button>
          </div>

          {errorMessage && (
            <div className="alert-error">Error: {errorMessage}</div>
          )}
        </form>
      </div>
    </div>
  )
}

export default AddBicycle