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
            <select
              id="bikeType"
              value={bikeType}
              onChange={(e) => setBikeType(e.target.value)}
            >
              <option value="">Select bike type</option>
              <option value="Mountain Bike">Mountain Bike</option>
              <option value="Road Bike">Road Bike</option>
              <option value="Hybrid Bike">Hybrid Bike</option>
              <option value="Electric Bike">Electric Bike</option>
              <option value="BMX">BMX</option>
              <option value="Kids Bike">Kids Bike</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="colour">Colour</label>
            <select
              id="colour"
              value={colour}
              onChange={(e) => setColour(e.target.value)}
            >
              <option value="">Select colour</option>
              <option value="Black">Black</option>
              <option value="White">White</option>
              <option value="Red">Red</option>
              <option value="Blue">Blue</option>
              <option value="Green">Green</option>
              <option value="Yellow">Orange</option>
              <option value="Purple">Purple</option>
              <option value="Grey">Grey</option>
              <option value="Silver">Silver</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="frameSize">Frame Size</label>
            <select
              id="frameSize"
              value={frameSize}
              onChange={(e) => setFrameSize(e.target.value)}
            >
              <option value="">Select frame size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div className="form-row">
            <label htmlFor="wheelSize">Wheel Size</label>
            <select
              id="wheelSize"
              value={wheelSize}
              onChange={(e) => setWheelSize(e.target.value)}
            >
            <option value="">Select wheel size</option>
            <option value="12 inch">12 inch</option>
            <option value="16 inch">16 inch</option>
            <option value="20 inch">20 inch</option>
            <option value="24 inch">24 inch</option>
            <option value="26 inch">26 inch</option>
            <option value="27.5 inch">27.5 inch</option>
            <option value="29 inch">29 inch</option>
            <option value="700C">700C</option>
            </select>
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