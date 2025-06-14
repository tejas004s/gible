import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar />
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
        <footer className="bg-primary text-white text-center py-3 mt-auto">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Gible Garbage Disposal App. All rights reserved.
          </p>
        </footer>
      </div>
    </Router>
  );
}

export default App;