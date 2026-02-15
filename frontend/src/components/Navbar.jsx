import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Inventory' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/stores', label: 'Stores' },
    { path: '/orders', label: 'Orders' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Food Inventory</Link>
        <ul className="navbar-nav me-auto">
          {navItems.map(item => (
            <li className="nav-item" key={item.path}>
              <Link
                className={`nav-link ${isActive(item.path) ? 'active fw-semibold' : ''}`}
                to={item.path}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="navbar-nav d-flex align-items-center">
          <span className="nav-link text-light">
            {user?.username}
          </span>
          <button className="btn btn-outline-light btn-sm ms-2" onClick={logout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
