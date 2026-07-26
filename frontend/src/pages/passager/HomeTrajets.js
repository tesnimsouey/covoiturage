import React, { useState, useEffect } from 'react';
import { LoadScript, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const tunisianCities = {
    'Tunis': { lat: 36.8190, lng: 10.1658 },
    'Ariana': { lat: 36.8625, lng: 10.1956 },
    'Ben Arous': { lat: 36.7533, lng: 10.2282 },
    'Manouba': { lat: 36.8089, lng: 10.0986 },
    'Nabeul': { lat: 36.4561, lng: 10.7376 },
    'Zaghouan': { lat: 36.4029, lng: 10.1429 },
    'Bizerte': { lat: 37.2744, lng: 9.8739 },
    'Beja': { lat: 36.7256, lng: 9.1817 },
    'Jendouba': { lat: 36.5011, lng: 8.7757 },
    'Le Kef': { lat: 36.1822, lng: 8.7148 },
    'Siliana': { lat: 36.0844, lng: 9.3708 },
    'Kairouan': { lat: 35.6781, lng: 10.0963 },
    'Kasserine': { lat: 35.1676, lng: 8.8365 },
    'Sidi Bouzid': { lat: 35.0382, lng: 9.4849 },
    'Sousse': { lat: 35.8256, lng: 10.6369 },
    'Monastir': { lat: 35.7643, lng: 10.8113 },
    'Mahdia': { lat: 35.5047, lng: 11.0622 },
    'Sfax': { lat: 34.7400, lng: 10.7600 },
    'Gafsa': { lat: 34.4250, lng: 8.7842 },
    'Tozeur': { lat: 33.9197, lng: 8.1335 },
    'Kebili': { lat: 33.7042, lng: 8.9694 },
    'Gabes': { lat: 33.8814, lng: 10.0982 },
    'Medenine': { lat: 33.3547, lng: 10.5053 },
    'Tataouine': { lat: 32.9211, lng: 10.4511 },
    'Hammamet': { lat: 36.4000, lng: 10.6167 },
};

const Card = ({ children, style }) => (
    <div style={{
        background: 'white', borderRadius: 20, padding: 20,
        border: '2px solid rgba(71,45,48,0.1)',
        boxShadow: '0 4px 20px rgba(71,45,48,0.08)', ...style
    }}>{children}</div>
);

const HomeTrajets = () => {
    const { user } = useAuth();
    const [trajets, setTrajets] = useState([]);
    const [topChauffeurs, setTopChauffeurs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [search, setSearch] = useState({ depart: '', destination: '' });
    const [priceRange, setPriceRange] = useState(50);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTrajet, setSelectedTrajet] = useState(null);
    const [moyensPaiement, setMoyensPaiement] = useState([]);
    const [selectedMoyen, setSelectedMoyen] = useState('');
    const [directions, setDirections] = useState(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [showPaypalForm, setShowPaypalForm] = useState(false);
    const [paypalData, setPaypalData] = useState({ email: '', cardNumber: '', expiry: '', cvv: '' });

    useEffect(() => {
        fetchTrajets();
        fetchMoyensPaiement();
        fetchTopChauffeurs();
    }, []);

    const fetchTrajets = async () => {
        try {
            const res = await API.get('/trajets');
            setTrajets(Array.isArray(res.data) ? res.data : []);
        } catch { setError('Erreur chargement trajets'); }
        finally { setLoading(false); }
    };

    const fetchMoyensPaiement = async () => {
        try {
            const res = await API.get(`/paiements/passager/${user.id}`);
            setMoyensPaiement(Array.isArray(res.data) ? res.data : []);
        } catch { console.error('Erreur moyens paiement'); }
    };

    const fetchTopChauffeurs = async () => {
        try {
            const res = await API.get('/chauffeurs/top');
            setTopChauffeurs(Array.isArray(res.data) ? res.data : []);
        } catch { console.error('Erreur top chauffeurs'); }
    };

    const showRoute = (trajet) => {
        if (!mapLoaded || !window.google) return;
        const o = tunisianCities[trajet.depart];
        const d = tunisianCities[trajet.destination];
        if (!o || !d) return;
        new window.google.maps.DirectionsService().route(
            { origin: o, destination: d, travelMode: 'DRIVING' },
            (result, status) => { if (status === 'OK') setDirections(result); }
        );
    };

    const handleReserver = (trajet) => {
        setSelectedTrajet(trajet);
        showRoute(trajet);
        setOpenDialog(true);
    };

   const confirmerReservation = async () => {
    if (!selectedMoyen) { setError('Veuillez choisir un mode de paiement'); return; }

    if (showPaypalForm) {
        if (!paypalData.email || !paypalData.cardNumber || !paypalData.expiry || !paypalData.cvv) {
            setError('Veuillez remplir toutes les informations PayPal');
            return;
        }
    }

    try {
        await API.post('/reservations', {
            passagerId: user.id,
            trajetId: selectedTrajet.id,
            moyenPaiementId: selectedMoyen
        });
        setSuccess(showPaypalForm
            ? '🅿️ Paiement PayPal effectué! Réservation confirmée!'
            : '💵 Réservation effectuée! Paiement en espèces au départ.');
        setOpenDialog(false);
        setShowPaypalForm(false);
        setSelectedMoyen('');
        setPaypalData({ email: '', cardNumber: '', expiry: '', cvv: '' });
        fetchTrajets();
    } catch (err) {
        setError(err.response?.data || 'Erreur lors de la réservation');
    }
};

    const filtered = trajets.filter(t =>
        t.depart?.toLowerCase().includes(search.depart.toLowerCase()) &&
        t.destination?.toLowerCase().includes(search.destination.toLowerCase()) &&
        t.prix <= priceRange
    );

    const rankColors = ['#C9CBA3', '#E26D5C', '#723D46', '#1B4FE4', '#472D30'];
    const rankLabels = ['🥇', '🥈', '🥉', '4', '5'];

    return (
        <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>

            {error && (
                <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 20px', color: '#C85A4A', fontWeight: 700, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                    ⚠️ {error}
                    <span style={{ cursor: 'pointer' }} onClick={() => setError('')}>✕</span>
                </div>
            )}
            {success && (
                <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 20px', color: '#3A6A1C', fontWeight: 700, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
                    ✅ {success}
                    <span style={{ cursor: 'pointer' }} onClick={() => setSuccess('')}>✕</span>
                </div>
            )}

            {/* MAP */}
            <Card style={{ marginBottom: 28, padding: 0, overflow: 'hidden' }}>
                <div style={{ background: '#E26D5C', padding: '14px 20px' }}>
                    <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 16, color: 'white' }}>
                        🗺️ Carte des Trajets — Tunisie
                    </h3>
                </div>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} onLoad={() => setMapLoaded(true)}>
                    <GoogleMap
                        mapContainerStyle={{ width: '100%', height: 380 }}
                        center={{ lat: 34.0, lng: 9.0 }} zoom={6}
                    >
                        {directions && <DirectionsRenderer directions={directions} />}
                    </GoogleMap>
                </LoadScript>
            </Card>

            {/* TOP CHAUFFEURS */}
            <Card style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 18, color: '#472D30', marginBottom: 16 }}>
                    ⭐ Top Chauffeurs
                </h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                    {topChauffeurs.map((c, i) => (
                        <div key={c.id} style={{
                            flex: '1', minWidth: 100, background: '#EFF2E0',
                            borderRadius: 16, padding: '14px 12px', textAlign: 'center',
                            border: i === 0 ? '2px solid #C9CBA3' : '2px solid transparent'
                        }}>
                            <div style={{
                                background: rankColors[i] || '#888', width: 44, height: 44,
                                borderRadius: 14, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', margin: '0 auto 8px',
                                fontFamily: 'Nunito, sans-serif', fontSize: 16,
                                fontWeight: 900, color: 'white'
                            }}>
                                {c.name?.charAt(0)}
                            </div>
                            <div style={{ fontSize: 14, fontWeight: 800, color: '#472D30', marginBottom: 3, fontFamily: 'Nunito, sans-serif' }}>
                                {rankLabels[i]} {c.name?.split(' ')[0]}
                            </div>
                            <div style={{ fontSize: 12, color: '#E26D5C', fontWeight: 700 }}>
                                ★ {c.rating?.toFixed(1)}
                            </div>
                        </div>
                    ))}
                </div>
            </Card>

            {/* SEARCH & FILTER */}
            <Card style={{ marginBottom: 28 }}>
                <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 18, color: '#472D30', marginBottom: 16 }}>
                    🔍 Rechercher un trajet
                </h3>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                    {[
                        { ph: '🏙 Ville de départ', key: 'depart' },
                        { ph: '📍 Destination', key: 'destination' }
                    ].map(f => (
                        <input key={f.key} placeholder={f.ph}
                            value={search[f.key]}
                            onChange={e => setSearch({ ...search, [f.key]: e.target.value })}
                            style={{
                                flex: 1, minWidth: 160, padding: '12px 16px',
                                border: '2px solid #E8D9C5', borderRadius: 12,
                                fontSize: 13, color: '#472D30', background: '#FFFAF5',
                                fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none'
                            }}
                            onFocus={e => e.target.style.borderColor = '#E26D5C'}
                            onBlur={e => e.target.style.borderColor = '#E8D9C5'}
                        />
                    ))}
                </div>
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#723D46', fontFamily: 'Nunito, sans-serif' }}>
                            💰 Prix maximum
                        </span>
                        <span style={{ fontSize: 13, fontWeight: 900, color: '#E26D5C', fontFamily: 'Nunito, sans-serif' }}>
                            {priceRange} DT
                        </span>
                    </div>
                    <input type="range" min="0" max="50" step="1"
                        value={priceRange}
                        onChange={e => setPriceRange(Number(e.target.value))}
                        style={{ width: '100%', accentColor: '#E26D5C', height: 6 }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                        <span style={{ fontSize: 11, color: '#9B8080', fontWeight: 600 }}>0 DT</span>
                        <span style={{ fontSize: 11, color: '#9B8080', fontWeight: 600 }}>50 DT</span>
                    </div>
                </div>
            </Card>

            {/* TRAJETS */}
            <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22, color: '#472D30', marginBottom: 20 }}>
                🚗 Trajets disponibles
                <span style={{ marginLeft: 10, background: '#E26D5C', color: 'white', fontSize: 13, padding: '3px 12px', borderRadius: 20, fontWeight: 800 }}>
                    {filtered.length}
                </span>
            </h2>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 40 }}>🚗</div>
                    <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12 }}>Chargement des trajets...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {filtered.map(trajet => (
                        <Card key={trajet.id} style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                                <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 12px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 13 }}>
                                    {trajet.depart}
                                </span>
                                <div style={{ width: 28, height: 28, background: '#E26D5C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: 13 }}>→</div>
                                <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 12px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 13 }}>
                                    {trajet.destination}
                                </span>
                                <span style={{
                                    marginLeft: 'auto', fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20,
                                    background: trajet.statut === 'OUVERT' ? '#EEF5E8' : trajet.statut === 'COMPLET' ? '#FAEAE8' : '#F5F5F5',
                                    color: trajet.statut === 'OUVERT' ? '#3A6A1C' : trajet.statut === 'COMPLET' ? '#C85A4A' : '#888'
                                }}>
                                    {trajet.statut === 'OUVERT' ? '● Ouvert' : trajet.statut === 'COMPLET' ? '● Complet' : trajet.statut}
                                </span>
                            </div>
                            <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                                <span style={{ background: '#FFF5E6', border: '1.5px solid #E8D9C5', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#723D46', fontWeight: 700 }}>
                                    🕐 {new Date(trajet.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                </span>
                                <span style={{ background: '#FFF5E6', border: '1.5px solid #E8D9C5', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#723D46', fontWeight: 700 }}>
                                    💺 {trajet.placesDisponibles} place(s)
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 26, fontWeight: 900, color: '#E26D5C' }}>
                                        {trajet.prix} DT
                                    </span>
                                    <span style={{ fontSize: 11, color: '#9B8080', marginLeft: 4 }}>/ place</span>
                                </div>
                                <button onClick={() => handleReserver(trajet)}
                                    disabled={trajet.statut !== 'OUVERT'}
                                    style={{
                                        background: trajet.statut === 'OUVERT' ? '#E26D5C' : '#ddd',
                                        color: trajet.statut === 'OUVERT' ? 'white' : '#999',
                                        border: 'none', borderRadius: 12, padding: '10px 20px',
                                        fontFamily: 'Nunito, sans-serif', fontWeight: 900,
                                        fontSize: 13, cursor: trajet.statut === 'OUVERT' ? 'pointer' : 'not-allowed'
                                    }}>
                                    Réserver →
                                </button>
                            </div>
                        </Card>
                    ))}
                    {filtered.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                            <div style={{ fontSize: 48 }}>🔍</div>
                            <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12, fontFamily: 'Nunito, sans-serif', fontSize: 18 }}>
                                Aucun trajet trouvé
                            </p>
                        </div>
                    )}
                </div>
            )}

          {/* DIALOG RESERVATION */}
{openDialog && selectedTrajet && (
    <div style={{
        position: 'fixed', inset: 0, background: 'rgba(71,45,48,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: 20
    }}>
        <div style={{
            background: 'white', borderRadius: 24, padding: 32,
            maxWidth: 480, width: '100%',
            boxShadow: '0 20px 60px rgba(71,45,48,0.3)'
        }}>
            <h3 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 22, color: '#472D30', marginBottom: 6 }}>
                Confirmer la réservation
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 14px', borderRadius: 20, fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>
                    {selectedTrajet.depart}
                </span>
                <span style={{ color: '#E26D5C', fontWeight: 900, fontSize: 18 }}>→</span>
                <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 14px', borderRadius: 20, fontWeight: 900, fontFamily: 'Nunito, sans-serif' }}>
                    {selectedTrajet.destination}
                </span>
            </div>
            <p style={{ color: '#9B8080', marginBottom: 6, fontSize: 13 }}>
                📅 {new Date(selectedTrajet.date).toLocaleString('fr-FR')}
            </p>
            <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#E26D5C', marginBottom: 20 }}>
                {selectedTrajet.prix} DT
            </p>

            {/* CHOIX DU MOYEN DE PAIEMENT */}
            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#723D46', marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Nunito, sans-serif' }}>
                Mode de paiement
            </label>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                {moyensPaiement.map(m => (
                    <button key={m.id}
                        onClick={() => {
                            setSelectedMoyen(m.id);
                            setShowPaypalForm(m.type === 'PayPal');
                            setPaypalData({ email: '', cardNumber: '', expiry: '', cvv: '' });
                        }}
                        style={{
                            flex: 1, padding: '14px 10px',
                            border: selectedMoyen === m.id ? '2.5px solid #E26D5C' : '2px solid #E8D9C5',
                            borderRadius: 14, cursor: 'pointer',
                            background: selectedMoyen === m.id ? '#FAEAE8' : '#FFFAF5',
                            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                            fontSize: 14, color: selectedMoyen === m.id ? '#E26D5C' : '#723D46',
                            transition: 'all 0.2s', textAlign: 'center'
                        }}>
                        {m.type === 'Espèces' ? '💵 Espèces' : '🅿️ PayPal'}
                    </button>
                ))}
            </div>

            {/* FORMULAIRE PAYPAL */}
           {showPaypalForm && (
    <div style={{
        background: '#F0F4FF', border: '2px solid #1B4FE4',
        borderRadius: 12, padding: 12, marginBottom: 16
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🅿️</span>
            <span style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 13, color: '#1B4FE4' }}>
                Informations PayPal
            </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
                { label: 'Email PayPal', key: 'email', type: 'email', ph: 'votre@paypal.com' },
                { label: 'Numéro de carte', key: 'cardNumber', type: 'text', ph: '1234 5678 9012 3456' },
                { label: 'Expiration', key: 'expiry', type: 'text', ph: 'MM/AA' },
                { label: 'CVV', key: 'cvv', type: 'text', ph: '123' },
            ].map(f => (
                <div key={f.key}>
                    <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: '#1B4FE4', marginBottom: 3, textTransform: 'uppercase' }}>
                        {f.label}
                    </label>
                    <input type={f.type} placeholder={f.ph}
                        value={paypalData[f.key]}
                        onChange={e => setPaypalData({ ...paypalData, [f.key]: e.target.value })}
                        style={{
                            width: '100%', padding: '7px 10px',
                            border: '1.5px solid #1B4FE4', borderRadius: 8,
                            fontSize: 12, color: '#1A1A2E', outline: 'none',
                            background: 'white', fontFamily: 'Plus Jakarta Sans, sans-serif'
                        }}
                    />
                </div>
            ))}
        </div>
    </div>
)}

            <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => { setOpenDialog(false); setShowPaypalForm(false); setSelectedMoyen(''); }} style={{
                    flex: 1, padding: '13px', background: '#EFF2E0',
                    border: 'none', borderRadius: 12, color: '#723D46',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14, cursor: 'pointer'
                }}>Annuler</button>
                <button onClick={confirmerReservation} style={{
                    flex: 2, padding: '13px', background: '#E26D5C',
                    border: 'none', borderRadius: 12, color: 'white',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14, cursor: 'pointer'
                }}>
                    {selectedMoyen && moyensPaiement.find(m => m.id === selectedMoyen)?.type === 'PayPal'
                        ? '🅿️ Payer via PayPal →'
                        : '💵 Confirmer →'}
                </button>
            </div>
        </div>
    </div>
)}
        </div>
    );
};

export default HomeTrajets;