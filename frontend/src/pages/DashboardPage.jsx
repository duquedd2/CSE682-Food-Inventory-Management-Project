import { useState, useEffect } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import InventoryTable from '../components/InventoryTable';
import AddItemModal from '../components/AddItemModal';

export default function DashboardPage() {
  const [items, setItems] = useState([]);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data } = await api.get('/items');
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to remove this item?')) return;
    try {
      await api.delete(`/items/${itemId}`);
      fetchItems();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setShowModal(true);
  };

  const handleSave = () => {
    setShowModal(false);
    setEditItem(null);
    fetchItems();
  };

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.expiration_status === filter);

  const counts = {
    all: items.length,
    green: items.filter(i => i.expiration_status === 'green').length,
    yellow: items.filter(i => i.expiration_status === 'yellow').length,
    red: items.filter(i => i.expiration_status === 'red').length,
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Your Inventory</h3>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Add Item
          </button>
        </div>

        {/* Filter buttons — FR-09: filter by expiration */}
        <div className="btn-group mb-3" role="group">
          <button
            className={`btn ${filter === 'all' ? 'btn-secondary' : 'btn-outline-secondary'}`}
            onClick={() => setFilter('all')}
          >
            All ({counts.all})
          </button>
          <button
            className={`btn ${filter === 'green' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilter('green')}
          >
            Fresh ({counts.green})
          </button>
          <button
            className={`btn ${filter === 'yellow' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFilter('yellow')}
          >
            Expiring Soon ({counts.yellow})
          </button>
          <button
            className={`btn ${filter === 'red' ? 'btn-danger' : 'btn-outline-danger'}`}
            onClick={() => setFilter('red')}
          >
            Expired ({counts.red})
          </button>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <InventoryTable
            items={filteredItems}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}

        {showModal && (
          <AddItemModal
            item={editItem}
            onClose={() => { setShowModal(false); setEditItem(null); }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
