import React, { useState } from 'react';
import {
    Container, Box, TextField, Button, Typography,
    Alert, Paper, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../api/axios';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await API.post('/auth/login', { email, password });
            login(response.data);
            if (response.data.role === 'PASSAGER') navigate('/');
            else if (response.data.role === 'CHAUFFEUR') navigate('/mes-trajets');
            else if (response.data.role === 'ADMIN') navigate('/admin');
        } catch (err) {
            setError(err.response?.data || 'Erreur de connexion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                        <DirectionsCarIcon sx={{ fontSize: 40, color: '#1976d2', mr: 1 }} />
                        <Typography variant="h4" fontWeight="bold" color="primary">
                            CoVoiturage
                        </Typography>
                    </Box>
                    <Typography variant="h6" textAlign="center" mb={3}>Connexion</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    <form onSubmit={handleLogin}>
                        <TextField fullWidth label="Email" type="email"
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            margin="normal" required />
                        <TextField fullWidth label="Mot de passe" type="password"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            margin="normal" required />
                        <Button fullWidth type="submit" variant="contained"
                            size="large" sx={{ mt: 3, mb: 2, borderRadius: 2 }} disabled={loading}>
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Se connecter'}
                        </Button>
                        <Button fullWidth variant="text" onClick={() => navigate('/register')}>
                            Pas de compte? S'inscrire
                        </Button>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default Login;