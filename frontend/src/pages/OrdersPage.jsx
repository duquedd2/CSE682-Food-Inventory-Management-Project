import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [meals, setMeals] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [mealsRes, restRes] = await Promise.all([
        api.get('/orders/meals'),
        api.get('/orders/restaurants'),
      ]);
      setMeals(mealsRes.data);
      setRestaurants(restRes.data);
    } catch (err) {
      console.error('Failed to fetch order data:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRestaurantFavorite = async (restaurantId) => {
    try {
      await api.post(`/orders/restaurants/${restaurantId}/favorite`);
      const { data } = await api.get('/orders/restaurants');
      setRestaurants(data);
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    }
  };

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const comingSoonBanner = (
    <div className="alert alert-warning d-flex align-items-center mb-4">
      <strong className="me-2">Coming Soon:</strong>
      <span>Ordering integration requires connecting to grocery delivery and restaurant services. This is a preview of the planned interface.</span>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3 className="mb-4">Orders</h3>

        {/* Tab navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'ingredients' ? 'active' : ''}`}
              onClick={() => setActiveTab('ingredients')}
            >
              Order Ingredients
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'food' ? 'active' : ''}`}
              onClick={() => setActiveTab('food')}
            >
              Order Food (Hot)
            </button>
          </li>
        </ul>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : activeTab === 'ingredients' ? (
          <div>
            {comingSoonBanner}

            {/* FR-18: Pre-determined meals with ingredients */}
            <div className="row">
              {meals.map(meal => (
                <div className="col-md-6 col-lg-4 mb-4" key={meal.recipe_id}>
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{meal.title}</h5>
                      <p className="card-text text-muted small">{meal.description}</p>

                      <h6 className="mt-3 mb-2">Ingredients:</h6>
                      <ul className="list-unstyled small">
                        {(meal.ingredients || []).map((ing, idx) => (
                          <li key={idx}>- {ing.quantity} {ing.unit} {ing.name}</li>
                        ))}
                      </ul>

                      <div className="d-flex gap-2 mt-3 flex-wrap">
                        <span className="badge bg-light text-dark border">
                          Total: {meal.total_time_minutes} min
                        </span>
                        <span className="badge bg-light text-dark border">
                          Serves {meal.servings}
                        </span>
                      </div>

                      {/* FR-19: Estimated time to start cooking and eating */}
                      <p className="text-muted small mt-2 mb-0">
                        Ready by: ~{formatTime(meal.estimated_ready_by)}
                        <br />
                        <span className="text-muted">(includes 30 min delivery estimate)</span>
                      </p>
                    </div>
                    <div className="card-footer bg-transparent">
                      <button className="btn btn-primary btn-sm w-100" disabled>
                        Add All to Cart (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div>
            {comingSoonBanner}

            {/* FR-XX: Restaurants with favorites first */}
            <div className="row">
              {restaurants.map(rest => (
                <div className="col-md-6 col-lg-4 mb-4" key={rest.restaurant_id}>
                  <div className={`card h-100 ${rest.is_favorite ? 'border-warning' : ''}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <h5 className="card-title mb-1">{rest.name}</h5>
                        <button
                          className={`btn btn-sm ${rest.is_favorite ? 'btn-warning' : 'btn-outline-warning'}`}
                          onClick={() => toggleRestaurantFavorite(rest.restaurant_id)}
                        >
                          {rest.is_favorite ? '\u2605' : '\u2606'}
                        </button>
                      </div>
                      <span className="badge bg-secondary mb-2">{rest.cuisine_type}</span>
                      <p className="card-text text-muted small mb-1">{rest.address}</p>
                      <p className="text-muted small mb-0">
                        Est. delivery: {rest.estimated_delivery_minutes} min
                      </p>
                      {rest.is_favorite && (
                        <span className="badge bg-warning text-dark mt-2">Favorite</span>
                      )}
                    </div>
                    <div className="card-footer bg-transparent">
                      <button className="btn btn-primary btn-sm w-100" disabled>
                        Order Now (Coming Soon)
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NFR-XX: Credit card standards notice */}
        <div className="alert alert-light border mt-4 small">
          <strong>Payment Security:</strong> When ordering is enabled, all payment processing will comply with PCI DSS standards. Credit card information will never be stored directly on our servers.
        </div>

        {/* NFR-XX: Offline buffering notice */}
        <div className="alert alert-light border small">
          <strong>Offline Support:</strong> Order drafts will be saved locally and submitted automatically when your connection is restored.
        </div>
      </div>
    </div>
  );
}
