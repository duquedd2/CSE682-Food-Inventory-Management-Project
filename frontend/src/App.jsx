import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RecipesPage from './pages/RecipesPage';
import RecipeDetailPage from './pages/RecipeDetailPage';
import GroceryStoresPage from './pages/GroceryStoresPage';
import OrdersPage from './pages/OrdersPage';

function PrivateRoute({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function PublicRoute({ children }) {
  const { token } = useAuth();
  return token ? <Navigate to="/" /> : children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={
            <PublicRoute><LoginPage /></PublicRoute>
          } />
          <Route path="/" element={
            <PrivateRoute><DashboardPage /></PrivateRoute>
          } />
          <Route path="/recipes" element={
            <PrivateRoute><RecipesPage /></PrivateRoute>
          } />
          <Route path="/recipes/:id" element={
            <PrivateRoute><RecipeDetailPage /></PrivateRoute>
          } />
          <Route path="/stores" element={
            <PrivateRoute><GroceryStoresPage /></PrivateRoute>
          } />
          <Route path="/orders" element={
            <PrivateRoute><OrdersPage /></PrivateRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
