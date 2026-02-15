import { useState, useEffect } from 'react';
import api from '../services/api';

export default function AddItemModal({ item, onClose, onSave }) {
  const [form, setForm] = useState({
    name: '',
    category: '',
    quantity: 1,
    unit: '',
    price: '',
    expiration_date: '',
    purchase_date: new Date().toISOString().split('T')[0],
    location: 'pantry',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name || '',
        category: item.category || '',
        quantity: item.quantity || 1,
        unit: item.unit || '',
        price: item.price || '',
        expiration_date: item.expiration_date ? item.expiration_date.split('T')[0] : '',
        purchase_date: item.purchase_date ? item.purchase_date.split('T')[0] : '',
        location: item.location || 'pantry',
      });
    }
  }, [item]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...form,
        price: form.price ? parseFloat(form.price) : null,
        quantity: parseFloat(form.quantity),
        expiration_date: form.expiration_date || null,
      };

      if (item) {
        await api.put(`/items/${item.item_id}`, payload);
      } else {
        await api.post('/items', payload);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{item ? 'Edit Item' : 'Add New Item'}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && <div className="alert alert-danger py-2">{error}</div>}

              <div className="mb-3">
                <label className="form-label">Name *</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="produce">Produce</option>
                    <option value="dairy">Dairy</option>
                    <option value="meat">Meat</option>
                    <option value="grains">Grains</option>
                    <option value="frozen">Frozen</option>
                    <option value="canned">Canned</option>
                    <option value="snacks">Snacks</option>
                    <option value="beverages">Beverages</option>
                    <option value="condiments">Condiments</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="col">
                  <label className="form-label">Location</label>
                  <select
                    className="form-select"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                  >
                    <option value="pantry">Pantry</option>
                    <option value="fridge">Fridge</option>
                    <option value="freezer">Freezer</option>
                    <option value="cabinet">Cabinet</option>
                    <option value="counter">Counter</option>
                  </select>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="col">
                  <label className="form-label">Unit</label>
                  <select
                    className="form-select"
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                  >
                    <option value="">Select...</option>
                    <option value="pcs">Pieces</option>
                    <option value="lbs">Pounds</option>
                    <option value="oz">Ounces</option>
                    <option value="gal">Gallons</option>
                    <option value="liters">Liters</option>
                    <option value="bags">Bags</option>
                    <option value="boxes">Boxes</option>
                    <option value="cans">Cans</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Price ($)</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>

              <div className="row mb-3">
                <div className="col">
                  <label className="form-label">Purchase Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="purchase_date"
                    value={form.purchase_date}
                    onChange={handleChange}
                  />
                </div>
                <div className="col">
                  <label className="form-label">Expiration Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expiration_date"
                    value={form.expiration_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
