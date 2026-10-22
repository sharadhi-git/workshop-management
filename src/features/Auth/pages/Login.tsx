//login page
import { useState } from 'react'
import { supabase } from '../../../lib/supabase'
import './login.css' // Import the CSS file for styling

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setMessage('Signing in...')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Login successful')
    }
  }

 return (
  <div className="login-page">
    <div className="login-card">
      <h1>Bicycle Workshop Management</h1>

      <form onSubmit={handleLogin}>
        <div className="login-field">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Sign in
        </button>
      </form>

      {message && <p className="login-message">{message}</p>}
    </div>
  </div>
)
}

export default Login