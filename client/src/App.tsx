import { useEffect, useState } from 'react'
import './App.css'

type HealthStatus = 'loading' | 'ok' | 'error'

function App() {
  const [status, setStatus] = useState<HealthStatus>('loading')

  useEffect(() => {
    fetch('/api/health')
      .then((res) => {
        if (!res.ok) throw new Error(`Unexpected status ${res.status}`)
        return res.json()
      })
      .then((data: { status: string }) => {
        setStatus(data.status === 'ok' ? 'ok' : 'error')
      })
      .catch(() => setStatus('error'))
  }, [])

  return (
    <main>
      <h1>Monarch</h1>
      <p data-testid="health-status">
        Server status:{' '}
        {status === 'loading' ? 'checking…' : status === 'ok' ? 'OK' : 'unreachable'}
      </p>
    </main>
  )
}

export default App
