import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';

export default function RecipeDetailPage() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [servingMultiplier, setServingMultiplier] = useState(1);
  const [excludedIngredients, setExcludedIngredients] = useState(new Set());

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const { data } = await api.get(`/recipes/${id}`);
      setRecipe(data);
      setServingMultiplier(1);
      setExcludedIngredients(new Set());
    } catch (err) {
      console.error('Failed to fetch recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (isLiked) => {
    try {
      if (recipe.user_feedback === isLiked) {
        await api.delete(`/recipes/${id}/feedback`);
      } else {
        await api.post(`/recipes/${id}/feedback`, { is_liked: isLiked });
      }
      fetchRecipe();
    } catch (err) {
      console.error('Failed to save feedback:', err);
    }
  };

  const toggleIngredient = (name) => {
    setExcludedIngredients(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  // FR-XX: Download recipe offline
  const handleDownload = () => {
    if (!recipe) return;
    const ingredients = (recipe.ingredients || [])
      .filter(ing => !excludedIngredients.has(ing.name))
      .map(ing => {
        const qty = parseFloat(ing.quantity) * servingMultiplier;
        return `  - ${qty} ${ing.unit} ${ing.name}`;
      })
      .join('\n');

    const text = [
      recipe.title,
      '='.repeat(recipe.title.length),
      '',
      recipe.description,
      '',
      `Prep: ${recipe.prep_time_minutes} min | Cook: ${recipe.cook_time_minutes} min | Serves: ${recipe.servings * servingMultiplier}`,
      '',
      'Ingredients:',
      ingredients,
      '',
      'Instructions:',
      recipe.instructions,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${recipe.title.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center py-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div>
        <Navbar />
        <div className="container mt-4 text-center py-5">
          <h5>Recipe not found</h5>
          <Link to="/recipes" className="btn btn-primary mt-3">Back to Recipes</Link>
        </div>
      </div>
    );
  }

  const totalTime = recipe.prep_time_minutes + recipe.cook_time_minutes;

  return (
    <div>
      <Navbar />
      <div className="container mt-4" style={{ maxWidth: '800px' }}>
        <Link to="/recipes" className="btn btn-outline-secondary btn-sm mb-3">
          &larr; Back to Recipes
        </Link>

        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h2>{recipe.title}</h2>
            <p className="text-muted">{recipe.description}</p>
          </div>
          {/* FR-12: Feedback */}
          <div className="btn-group">
            <button
              className={`btn ${recipe.user_feedback === true ? 'btn-success' : 'btn-outline-success'}`}
              onClick={() => handleFeedback(true)}
            >
              &#x1F44D; {recipe.likes || 0}
            </button>
            <button
              className={`btn ${recipe.user_feedback === false ? 'btn-danger' : 'btn-outline-danger'}`}
              onClick={() => handleFeedback(false)}
            >
              &#x1F44E; {recipe.dislikes || 0}
            </button>
          </div>
        </div>

        {/* Time and serving info */}
        <div className="d-flex gap-3 mb-4 flex-wrap">
          <span className="badge bg-light text-dark border fs-6">
            Prep: {recipe.prep_time_minutes} min
          </span>
          <span className="badge bg-light text-dark border fs-6">
            Cook: {recipe.cook_time_minutes} min
          </span>
          <span className="badge bg-primary fs-6">
            Total: {totalTime} min
          </span>
          <span className={`badge fs-6 ${recipe.difficulty === 'easy' ? 'bg-success' : recipe.difficulty === 'medium' ? 'bg-warning text-dark' : 'bg-danger'}`}>
            {recipe.difficulty}
          </span>
        </div>

        <div className="row">
          {/* Ingredients column */}
          <div className="col-md-5 mb-4">
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <strong>Ingredients</strong>
                {/* FR-13: Meal size / serving adjuster */}
                <div className="d-flex align-items-center gap-2">
                  <small className="text-muted">Servings:</small>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setServingMultiplier(Math.max(0.5, servingMultiplier - 0.5))}
                  >-</button>
                  <span className="fw-bold">{recipe.servings * servingMultiplier}</span>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setServingMultiplier(servingMultiplier + 0.5)}
                  >+</button>
                </div>
              </div>
              <ul className="list-group list-group-flush">
                {(recipe.ingredients || []).map((ing, idx) => {
                  const excluded = excludedIngredients.has(ing.name);
                  const qty = (parseFloat(ing.quantity) * servingMultiplier).toFixed(1).replace(/\.0$/, '');
                  return (
                    <li
                      key={idx}
                      className={`list-group-item d-flex align-items-center ${excluded ? 'text-decoration-line-through text-muted' : ''}`}
                    >
                      {/* FR-10: Customize — toggle ingredients */}
                      <input
                        type="checkbox"
                        className="form-check-input me-2"
                        checked={!excluded}
                        onChange={() => toggleIngredient(ing.name)}
                      />
                      <span>{qty} {ing.unit} <strong>{ing.name}</strong></span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Instructions column */}
          <div className="col-md-7 mb-4">
            <div className="card">
              <div className="card-header"><strong>Instructions</strong></div>
              <div className="card-body">
                {recipe.instructions.split('\n').map((step, idx) => (
                  <p key={idx} className="mb-2">{step}</p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FR-XX: Download recipe offline */}
        <div className="text-center mb-4">
          <button className="btn btn-outline-primary" onClick={handleDownload}>
            Download Recipe
          </button>
        </div>
      </div>
    </div>
  );
}
