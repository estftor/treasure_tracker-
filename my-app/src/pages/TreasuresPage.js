import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createTreasure, deleteTreasure, getTreasures } from '../api/treasures'

function treasureIcon(treasure) {
  if (treasure.deal_available) return '💰'
  return ['🧭', '⚓', '🗺️', '🔭'][treasure.name.length % 4]
}

export default function TreasuresPage({ session }) {
  const [treasures, setTreasures] = useState([])
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')
  const [store, setStore] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.access_token) {
      setIsLoading(false)
      return
    }

    async function loadTreasures() {
      setIsLoading(true)
      setError('')

      try {
        const data = await getTreasures(session.access_token)
        setTreasures(data.treasures)
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadTreasures()
  }, [session?.access_token])

  const removeTreasure = async (id) => {
    setRemovingId(id)
    setError('')

    try {
      await deleteTreasure(session.access_token, id)
      setTreasures((currentTreasures) => currentTreasures.filter((treasure) => treasure.id !== id))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setRemovingId(null)
    }
  }

  const addTreasure = async (event) => {
    event.preventDefault()

    if (!name.trim()) return

    setIsSaving(true)
    setError('')

    try {
      const data = await createTreasure(session.access_token, {
        name,
        store,
        item: 'Wishlist item',
        dealAvailable: false,
      })

      setTreasures((currentTreasures) => [...currentTreasures, data.treasure])
      setName('')
      setStore('')
      setIsAdding(false)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!session?.access_token) {
    return (
      <main className="treasures-page">
        <section className="empty-treasures">
          <span aria-hidden="true">🔒</span>
          <h1>Sign in to see your treasures.</h1>
          <p>Your wishlist is stored securely with your account.</p>
          <Link className="treasure-button" to="/signin">Sign in</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="treasures-page">
      <header className="treasures-header">
        <div>
          <p className="home-eyebrow">⚓ Your collection</p>
          <h1>My Treasures</h1>
          <p>Every great hunt starts with a well-kept wish list.</p>
        </div>
        <span className="treasure-total">{treasures.length} saved</span>
      </header>

      {error ? <p className="treasures-error" role="alert">{error}</p> : null}

      {isLoading ? (
        <section className="empty-treasures">
          <span aria-hidden="true">🧭</span>
          <h2>Finding your treasures…</h2>
        </section>
      ) : treasures.length > 0 ? (
        <section className="treasures-grid" aria-label="Your wishlist">
          {treasures.map((treasure) => (
            <article className="treasure-card" key={treasure.id}>
              <button
                type="button"
                className="remove-treasure"
                onClick={() => removeTreasure(treasure.id)}
                aria-label={`Remove ${treasure.name} from your wishlist`}
                disabled={removingId === treasure.id}
              >
                {removingId === treasure.id ? '…' : '×'}
              </button>
              <span className="treasure-icon" aria-hidden="true">{treasureIcon(treasure)}</span>
              <p className="treasure-category">{treasure.item || 'Wishlist item'}</p>
              <h2>{treasure.name}</h2>
              <p className="treasure-store">{treasure.store}</p>
            </article>
          ))}
        </section>
      ) : (
        <section className="empty-treasures">
          <span aria-hidden="true">🏝️</span>
          <h2>Your chest is empty.</h2>
          <p>Add an item below to start your next treasure hunt.</p>
        </section>
      )}

      <section className="add-treasure-section">
        {isAdding ? (
          <form className="add-treasure-form" onSubmit={addTreasure}>
            <label>
              Treasure name
              <input value={name} onChange={(event) => setName(event.target.value)} autoFocus required />
            </label>
            <label>
              Store
              <input value={store} onChange={(event) => setStore(event.target.value)} />
            </label>
            <div className="add-form-actions">
              <button type="button" className="cancel-button" onClick={() => setIsAdding(false)} disabled={isSaving}>Cancel</button>
              <button type="submit" className="add-button" disabled={isSaving}>
                {isSaving ? 'Adding…' : 'Add treasure'}
              </button>
            </div>
          </form>
        ) : (
          <button type="button" className="add-button add-wishlist-button" onClick={() => setIsAdding(true)}>
            <span aria-hidden="true">＋</span> Add to wishlist
          </button>
        )}
      </section>
    </main>
  )
}
