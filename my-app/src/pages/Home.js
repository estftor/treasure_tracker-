import { Link } from 'react-router-dom'

const wishlist = [
  { icon: '🧭', name: 'Leather-bound travel journal', store: 'Portside Goods' },
  { icon: '⚓', name: 'Brass anchor bookends', store: 'The Curio Shop' },
  { icon: '🗺️', name: 'Vintage world map print', store: 'Map & Compass' },
]

const activeDeals = [
  { icon: '💰', title: '20% off nautical décor', store: 'Portside Goods', expires: 'Ends Sunday' },
  { icon: '🏴‍☠️', title: 'Buy one, get one 50% off', store: 'The Curio Shop', expires: '3 days left' },
]

export default function Home() {
  return (
    <main className="home-page">
      <header className="home-header">
        <div>
          <p className="home-eyebrow">⚓ Treasure Tracker</p>
          <h1>Ahoy, treasure hunter!</h1>
          <p className="home-intro">Keep your wish list close and your best deals closer.</p>
        </div>
        <Link className="treasure-button" to="/treasures">
          View all treasures <span aria-hidden="true">→</span>
        </Link>
      </header>

      <section className="home-section" aria-labelledby="wishlist-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Your loot</p>
            <h2 id="wishlist-heading">Wishlist</h2>
          </div>
          <Link to="/treasures">See all</Link>
        </div>

        <div className="wishlist-grid">
          {wishlist.map((treasure) => (
            <article className="wish-card" key={treasure.name}>
              <span className="wish-icon" aria-hidden="true">{treasure.icon}</span>
              <div>
                <h3>{treasure.name}</h3>
                <p>{treasure.store}</p>
              </div>
              <button type="button" className="more-button" aria-label={`More options for ${treasure.name}`}>
                •••
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="deals-heading">
        <div className="section-heading">
          <div>
            <p className="section-kicker">Worth a look</p>
            <h2 id="deals-heading">Active deals</h2>
          </div>
          <span className="deal-count">{activeDeals.length} live</span>
        </div>

        <div className="deals-list">
          {activeDeals.map((deal) => (
            <article className="deal-card" key={deal.title}>
              <span className="deal-icon" aria-hidden="true">{deal.icon}</span>
              <div className="deal-copy">
                <h3>{deal.title}</h3>
                <p>{deal.store}</p>
              </div>
              <span className="expires-label">{deal.expires}</span>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
