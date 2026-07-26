import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MesReservations = () => {
    const { user } = useAuth();
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchReservations(); }, []);

    const fetchReservations = async () => {
        try {
            const res = await API.get(`/reservations/passager/${user.id}`);
            setReservations(Array.isArray(res.data) ? res.data : []);
        } catch { setError('Erreur chargement'); }
        finally { setLoading(false); }
    };

    const annuler = async (id) => {
        try {
            await API.put(`/reservations/annuler/${id}?passagerId=${user.id}`);
            setSuccess('Réservation annulée');
            fetchReservations();
        } catch (err) { setError(err.response?.data || 'Erreur'); }
    };

    const statutStyle = (s) => ({
        'CONFIRMEE': { bg: '#EEF5E8', color: '#3A6A1C', label: '✅ Confirmée' },
        'EN_ATTENTE': { bg: '#FFF5E6', color: '#C87A1A', label: '⏳ En attente' },
        'ANNULEE': { bg: '#FAEAE8', color: '#C85A4A', label: '❌ Annulée' },
        'REMBOURSEE': { bg: '#E6EEFF', color: '#1B4FE4', label: '💰 Remboursée' },
    }[s] || { bg: '#F5F5F5', color: '#888', label: s });

    return (
        <div style={{ padding: '32px', maxWidth: 1000, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 28, color: '#472D30', marginBottom: 8 }}>
                Mes Réservations
            </h1>
            <p style={{ color: '#9B8080', marginBottom: 28, fontSize: 14 }}>
                Gérez toutes vos réservations ici
            </p>

            {error && <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 20px', color: '#C85A4A', fontWeight: 700, marginBottom: 20 }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 20px', color: '#3A6A1C', fontWeight: 700, marginBottom: 20 }}>✅ {success}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 40 }}>⏳</div>
                    <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12 }}>Chargement...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
                    {reservations.map(r => {
                        const st = statutStyle(r.statut);
                        return (
                            <div key={r.id} style={{
                                background: 'white', borderRadius: 20, padding: 22,
                                border: '2px solid rgba(71,45,48,0.1)',
                                boxShadow: '0 4px 20px rgba(71,45,48,0.08)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                    <div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <span style={{ background: '#EFF2E0', color: '#472D30', padding: '4px 10px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12 }}>
                                                {r.trajet?.depart}
                                            </span>
                                            <span style={{ color: '#E26D5C', fontWeight: 900 }}>→</span>
                                            <span style={{ background: '#EFF2E0', color: '#472D30', padding: '4px 10px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12 }}>
                                                {r.trajet?.destination}
                                            </span>
                                        </div>
                                    </div>
                                    <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 800, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                                        {st.label}
                                    </span>
                                </div>
                                <p style={{ color: '#9B8080', fontSize: 12, marginBottom: 6 }}>
                                    📅 {r.trajet?.date ? new Date(r.trajet.date).toLocaleString('fr-FR') : 'N/A'}
                                </p>
                                <p style={{ fontFamily: 'Nunito, sans-serif', fontSize: 22, fontWeight: 900, color: '#E26D5C', marginBottom: 14 }}>
                                    {r.montant} DT
                                </p>
                                {(r.statut === 'EN_ATTENTE' || r.statut === 'CONFIRMEE') && (
                                    <button onClick={() => annuler(r.id)} style={{
                                        width: '100%', padding: '11px',
                                        background: '#FAEAE8', border: '1.5px solid #E26D5C',
                                        color: '#C85A4A', borderRadius: 12,
                                        fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                                        fontSize: 13, cursor: 'pointer'
                                    }}>
                                        Annuler la réservation
                                    </button>
                                )}
                            </div>
                        );
                    })}
                    {reservations.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                            <div style={{ fontSize: 48 }}>🎫</div>
                            <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12, fontFamily: 'Nunito, sans-serif', fontSize: 18 }}>
                                Aucune réservation
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MesReservations;