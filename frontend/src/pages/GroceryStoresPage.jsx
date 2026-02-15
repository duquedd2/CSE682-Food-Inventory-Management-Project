import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function GroceryStoresPage() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visitedAfter, setVisitedAfter] = useState('');
  const [visitedBefore, setVisitedBefore] = useState('');
  const [locationStatus, setLocationStatus] = useState('prompt'); // prompt, granted, denied
  const [userCoords, setUserCoords] = useState(null);

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams();
      if (visitedAfter) params.append('visited_after', visitedAfter);
      if (visitedBefore) params.append('visited_before', visitedBefore);
      const query = params.toString() ? `?${params.toString()}` : '';
      const { data } = await api.get(`/stores${query}`);
      setStores(data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [visitedAfter, visitedBefore]);

  // NFR-XX: Request location services
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationStatus('granted');
      },
      () => setLocationStatus('denied')
    );
  };

  const toggleFavorite = async (storeId) => {
    try {
      await api.post(`/stores/${storeId}/favorite`);
      fetchStores();
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const recordVisit = async (storeId) => {
    try {
      await api.post(`/stores/${storeId}/visit`);
      fetchStores();
    } catch (err) {
      console.error('Failed to record visit:', err);
    }
  };

  // FR-17: Calculate distance (Haversine formula)
  const calcDistance = (lat, lng) => {
    if (!userCoords || !lat || !lng) return null;
    const R = 3959; // Earth radius in miles
    const dLat = (lat - userCoords.lat) * Math.PI / 180;
    const dLng = (lng - userCoords.lng) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(userCoords.lat * Math.PI / 180) * Math.cos(lat * Math.PI / 180) *
      Math.sin(dLng / 2) ** 2;
    return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
  };

  // FR-17: Environmental impact estimate (~0.89 lbs CO2 per mile, round trip)
  const calcCO2 = (miles) => {
    if (!miles) return null;
    return (parseFloat(miles) * 0.89 * 2).toFixed(1);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3 className="mb-4">Grocery Stores</h3>

        {/* NFR-XX: Location services prompt */}
        {locationStatus === 'prompt' && (
          <div className="alert alert-info d-flex justify-content-between align-items-center">
            <span>Enable location to see distance and environmental impact for each store.</span>
            <button className="btn btn-sm btn-info" onClick={requestLocation}>
              Enable Location
            </button>
          </div>
        )}
        {locationStatus === 'denied' && (
          <div className="alert alert-warning">
            Location access was denied. Distance estimates are unavailable.
          </div>
        )}

        {/* FR-15: Filter by visit date range */}
        <div className="d-flex gap-3 mb-4 flex-wrap align-items-end">
          <div>
            <label className="form-label small text-muted mb-1">Visited After</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={visitedAfter}
              onChange={(e) => setVisitedAfter(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label small text-muted mb-1">Visited Before</label>
            <input
              type="date"
              className="form-control form-control-sm"
              value={visitedBefore}
              onChange={(e) => setVisitedBefore(e.target.value)}
            />
          </div>
          {(visitedAfter || visitedBefore) && (
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => { setVisitedAfter(''); setVisitedBefore(''); }}
            >
              Clear Filters
            </button>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : stores.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No stores found</h5>
            <p>Try clearing the date filters.</p>
          </div>
        ) : (
          <div className="row">
            {stores.map(store => {
              const dist = calcDistance(parseFloat(store.latitude), parseFloat(store.longitude));
              const co2 = calcCO2(dist);
              return (
                <div className="col-md-6 col-lg-4 mb-4" key={store.store_id}>
                  <div className={`card h-100 ${store.is_favorite ? 'border-warning' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">{store.name}</h5>
                        {/* FR-14: Favorite toggle */}
                        <button
                          className={`btn btn-sm ${store.is_favorite ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => toggleFavorite(store.store_id)}
                          title={store.is_favorite ? 'Unfavorite' : 'Favorite'}
                        >
                          {store.is_favorite ? '\u2605' : '\u2606'}
                        </button>
                      </div>
                      <p className="card-text text-muted small mb-1">
                        {store.address}, {store.city}, {store.state} {store.zip_code}
                      </p>

                      {/* FR-17: Distance + environmental impact */}
                      {dist && (
                        <div className="mt-2">
                          <span className="badge bg-info text-dark me-2">
                            {dist} mi away
                          </span>
                          <span className="badge bg-success" title="Estimated round-trip CO2 emissions">
                            ~{co2} lbs CO2 round trip
                          </span>
                        </div>
                      )}

                      {store.last_visited && (
                        <p className="text-muted small mt-2 mb-0">
                          Last visited: {new Date(store.last_visited).toLocaleDateString()}
                        </p>
                      )}

                      {store.is_favorite && (
                        <span className="badge bg-warning text-dark mt-2">Favorite</span>
                      )}
                    </div>
                    <div className="card-footer bg-transparent">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => recordVisit(store.store_id)}
                      >
                        Log Visit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
