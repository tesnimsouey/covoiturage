import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
            <Toolbar>
                <DirectionsCarIcon sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                    CoVoiturage
                </Typography>
                {user?.role === 'PASSAGER' && (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/')}>Trajets</Button>
                        <Button color="inherit" onClick={() => navigate('/mes-reservations')}>
                            Mes Réservations
                        </Button>
                    </Box>
                )}
                {user?.role === 'CHAUFFEUR' && (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/mes-trajets')}>
                            Mes Trajets
                        </Button>
                        <Button color="inherit" onClick={() => navigate('/proposer-trajet')}>
                            Proposer un Trajet
                        </Button>
                    </Box>
                )}
                {user?.role === 'ADMIN' && (
                    <Box>
                        <Button color="inherit" onClick={() => navigate('/admin')}>Dashboard</Button>
                    </Box>
                )}
                <Typography sx={{ mx: 2 }}>{user?.name}</Typography>
                <Button color="inherit" onClick={handleLogout}>Déconnexion</Button>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;