import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
    <div>
      <h1>Add Bicycle</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Brand</label>
          <br />
          <input
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </div>

        <div>
          <label>Model</label>
          <br />
          <input
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
        </div>

        <div>
          <label>Bike Type</label>
          <br />
          <input
            value={bikeType}
            onChange={(e) => setBikeType(e.target.value)}
          />
        </div>

        <div>
          <label>Colour</label>
          <br />
          <input
            value={colour}
            onChange={(e) => setColour(e.target.value)}
          />
        </div>

        <div>
          <label>Frame Size</label>
          <br />
          <input
            value={frameSize}
            onChange={(e) => setFrameSize(e.target.value)}
          />
        </div>

        <div>
          <label>Wheel Size</label>
          <br />
          <input
            value={wheelSize}
            onChange={(e) => setWheelSize(e.target.value)}
          />
        </div>

        <div>
          <label>Purchase Price</label>
          <br />
          <input
            type="number"
            step="0.01"
            min="0"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Purchase Source</label>
          <br />
          <input
            value={purchaseSource}
            onChange={(e) => setPurchaseSource(e.target.value)}
          />
        </div>

        <div>
          <label>Pickup Location</label>
          <br />
          <input
            value={pickupLocation}
            onChange={(e) => setPickupLocation(e.target.value)}
          />
        </div>

        <div>
          <label>Condition Notes</label>
          <br />
          <textarea
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
          />
        </div>

        <br />

        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Add Bicycle'}
        </button>

        {errorMessage && (
          <p>Error: {errorMessage}</p>
        )}
      </form>
    </div>
  )
}

export default AddBicycle