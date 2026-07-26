import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import HomeTrajets from './pages/passager/HomeTrajets';
import MesReservations from './pages/passager/MesReservations';
import MesTrajets from './pages/chauffeur/MesTrajets';
import ProposerTrajet from './pages/chauffeur/ProposerTrajet';
import AdminDashboard from './pages/admin/AdminDashboard';
import Navbar from './components/Navbar';

const PrivateRoute = ({ children, roles }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
    return children;
};

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <>
            {user && <Navbar />}
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={
                    <PrivateRoute roles={['PASSAGER']}>
                        <HomeTrajets />
                    </PrivateRoute>
                } />
                <Route path="/mes-reservations" element={
                    <PrivateRoute roles={['PASSAGER']}>
                        <MesReservations />
                    </PrivateRoute>
                } />
                <Route path="/mes-trajets" element={
                    <PrivateRoute roles={['CHAUFFEUR']}>
                        <MesTrajets />
                    </PrivateRoute>
                } />
                <Route path="/proposer-trajet" element={
                    <PrivateRoute roles={['CHAUFFEUR']}>
                        <ProposerTrajet />
                    </PrivateRoute>
                } />
                <Route path="/admin" element={
                    <PrivateRoute roles={['ADMIN']}>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
            </Routes>
        </>
    );
};

function App() {
    return (
        <AuthProvider>
            <Router>
                <AppRoutes />
            </Router>
        </AuthProvider>
    );
}

export default App;