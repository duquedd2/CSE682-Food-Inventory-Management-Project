import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function RecipesPage() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [prepFilter, setPrepFilter] = useState('all');
  const [servingsFilter, setServingsFilter] = useState('');
  const [viewMode, setViewMode] = useState('all'); // 'all' or 'suggestions'

  const fetchRecipes = async () => {
    setLoading(true);
    try {
      const endpoint = viewMode === 'suggestions' ? '/recipes/suggestions' : '/recipes';
      const params = new URLSearchParams();
      if (prepFilter !== 'all') params.append('prep_time', prepFilter);
      if (servingsFilter) params.append('servings', servingsFilter);
      const query = params.toString() ? `?${params.toString()}` : '';
      const { data } = await api.get(`${endpoint}${query}`);
      setRecipes(data);
    } catch (err) {
      console.error('Failed to fetch recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipes();
  }, [prepFilter, servingsFilter, viewMode]);

  const handleFeedback = async (recipeId, isLiked) => {
    try {
      const recipe = recipes.find(r => r.recipe_id === recipeId);
      if (recipe.user_feedback === isLiked) {
        await api.delete(`/recipes/${recipeId}/feedback`);
      } else {
        await api.post(`/recipes/${recipeId}/feedback`, { is_liked: isLiked });
      }
      fetchRecipes();
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const formatTime = (minutes) => {
    if (minutes === 0) return 'None';
    if (minutes < 60) return `${minutes} min`;
    return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h3 className="mb-4">Recipes</h3>

        {/* View toggle */}
        <div className="btn-group mb-3 me-3">
          <button
            className={`btn ${viewMode === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('all')}
          >
            All Recipes
          </button>
          <button
            className={`btn ${viewMode === 'suggestions' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setViewMode('suggestions')}
          >
            Based on My Inventory
          </button>
        </div>

        {/* FR-11: Prep time filter */}
        <div className="d-flex gap-3 mb-4 flex-wrap align-items-end">
          <div>
            <label className="form-label small text-muted mb-1">Prep Time</label>
            <select
              className="form-select form-select-sm"
              value={prepFilter}
              onChange={(e) => setPrepFilter(e.target.value)}
            >
              <option value="all">Any</option>
              <option value="quick">Quick (&lt; 15 min)</option>
              <option value="medium">Medium (15-30 min)</option>
              <option value="long">Long (&gt; 30 min)</option>
            </select>
          </div>

          {/* FR-13: Servings / meal size filter */}
          <div>
            <label className="form-label small text-muted mb-1">Serves up to</label>
            <select
              className="form-select form-select-sm"
              value={servingsFilter}
              onChange={(e) => setServingsFilter(e.target.value)}
            >
              <option value="">Any</option>
              <option value="1">1 person</option>
              <option value="2">2 people</option>
              <option value="4">4 people</option>
              <option value="6">6 people</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <h5>No recipes found</h5>
            <p>Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="row">
            {recipes.map(recipe => (
              <div className="col-md-6 col-lg-4 mb-4" key={recipe.recipe_id}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{recipe.title}</h5>
                    <p className="card-text text-muted small flex-grow-1">
                      {recipe.description}
                    </p>

                    {/* Inventory match indicator */}
                    {viewMode === 'suggestions' && (
                      <div className="mb-2">
                        <span className={`badge ${recipe.matching_count > 0 ? 'bg-success' : 'bg-secondary'}`}>
                          {recipe.matching_count}/{recipe.total_ingredients} ingredients matched
                        </span>
                      </div>
                    )}

                    <div className="d-flex gap-2 mb-3 flex-wrap">
                      <span className="badge bg-light text-dark border">
                        Prep: {formatTime(recipe.prep_time_minutes)}
                      </span>
                      <span className="badge bg-light text-dark border">
                        Cook: {formatTime(recipe.cook_time_minutes)}
                      </span>
                      <span className="badge bg-light text-dark border">
                        Serves {recipe.servings}
                      </span>
                      <span className={`badge ${recipe.difficulty === 'easy' ? 'bg-success' : recipe.difficulty === 'medium' ? 'bg-warning text-dark' : 'bg-danger'}`}>
                        {recipe.difficulty}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/recipes/${recipe.recipe_id}`} className="btn btn-sm btn-outline-primary">
                        View Recipe
                      </Link>

                      {/* FR-12: Thumbs up/down feedback */}
                      <div className="btn-group btn-group-sm">
                        <button
                          className={`btn ${recipe.user_feedback === true ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleFeedback(recipe.recipe_id, true)}
                          title="Like"
                        >
                          &#x1F44D;
                        </button>
                        <button
                          className={`btn ${recipe.user_feedback === false ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleFeedback(recipe.recipe_id, false)}
                          title="Dislike"
                        >
                          &#x1F44E;
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
