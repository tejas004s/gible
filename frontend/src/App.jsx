import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation
} from 'react-router-dom';
import Login from './components/Login';
import Signup from './components/Signup';
import PickupForm from './components/PickupForm';
import PickupStatus from './components/PickupStatus';
import AdminDashboard from './components/AdminDashboard';
import Analytics from './components/Analytics';
import Home from './components/Home';
import Navbar from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

function AppContent() {
  const location = useLocation();
  const hideNavbarOn = ['/login', '/signup'];
  const shouldShowNavbar = !hideNavbarOn.includes(location.pathname);

  return (
    <div className="App d-flex flex-column min-vh-100">
      {shouldShowNavbar && <Navbar />}

      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pickup" element={<PickupForm />} />
          <Route path="/status" element={<PickupStatus />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default AppWrapper;
