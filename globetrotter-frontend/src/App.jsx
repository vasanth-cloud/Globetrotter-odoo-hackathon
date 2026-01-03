import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import TripDetails from './pages/TripDetails';
import TripTimeline from './pages/TripTimeline';
import SharedTrip from './pages/SharedTrip';
import Profile from './pages/Profile';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shared/:id" element={<SharedTrip />} />
        
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
        
        <Route path="/profile" element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        } />
        
        <Route path="/create-trip" element={
          <PrivateRoute>
            <CreateTrip />
          </PrivateRoute>
        } />
        
        <Route path="/trips/:id" element={
          <PrivateRoute>
            <TripDetails />
          </PrivateRoute>
        } />
        
        <Route path="/trips/:id/timeline" element={
          <PrivateRoute>
            <TripTimeline />
          </PrivateRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </BrowserRouter>
  );
}
