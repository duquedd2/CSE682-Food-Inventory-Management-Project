export default function InventoryTable({ items, onEdit, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-5 text-muted">
        <h5>No items found</h5>
        <p>Add your first food item to get started!</p>
      </div>
    );
  }

  const getRowClass = (status) => {
    switch (status) {
      case 'red': return 'table-danger';
      case 'yellow': return 'table-warning';
      case 'green': return 'table-success';
      default: return '';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      red: { className: 'bg-danger', text: 'Expired' },
      yellow: { className: 'bg-warning text-dark', text: 'Expiring Soon' },
      green: { className: 'bg-success', text: 'Fresh' },
    };
    const badge = badges[status] || badges.green;
    return <span className={`badge ${badge.className}`}>{badge.text}</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '--';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Location</th>
            <th>Price</th>
            <th>Purchased</th>
            <th>Expires</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.item_id} className={getRowClass(item.expiration_status)}>
              <td className="fw-bold">{item.name}</td>
              <td>{item.category || '--'}</td>
              <td>{item.quantity} {item.unit || ''}</td>
              <td className="text-capitalize">{item.location}</td>
              <td>{item.price ? `$${parseFloat(item.price).toFixed(2)}` : '--'}</td>
              <td>{formatDate(item.purchase_date)}</td>
              <td>{formatDate(item.expiration_date)}</td>
              <td>{getStatusBadge(item.expiration_status)}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary me-1"
                  onClick={() => onEdit(item)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => onDelete(item.item_id)}
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
