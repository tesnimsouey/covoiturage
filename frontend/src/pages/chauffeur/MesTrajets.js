import React, { useState, useEffect } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const MesTrajets = () => {
    const { user } = useAuth();
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchTrajets(); }, []);

    const fetchTrajets = async () => {
        try {
            const res = await API.get(`/trajets/chauffeur/${user.id}`);
            setTrajets(Array.isArray(res.data) ? res.data : []);
        } catch { setError('Erreur chargement'); }
        finally { setLoading(false); }
    };

    const annuler = async (id) => {
        try {
            await API.put(`/trajets/annuler/${id}?chauffeurId=${user.id}`);
            setSuccess('Trajet annulé');
            fetchTrajets();
        } catch (err) { setError(err.response?.data || 'Erreur'); }
    };

    const statutStyle = (s) => ({
        'OUVERT': { bg: '#EEF5E8', color: '#3A6A1C', label: '● Ouvert' },
        'COMPLET': { bg: '#FFF5E6', color: '#C87A1A', label: '● Complet' },
        'ANNULE': { bg: '#FAEAE8', color: '#C85A4A', label: '● Annulé' },
        'TERMINE': { bg: '#E6EEFF', color: '#1B4FE4', label: '● Terminé' },
    }[s] || { bg: '#F5F5F5', color: '#888', label: s });

    return (
        <div style={{ padding: '32px', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
                <div>
                    <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 28, color: '#472D30', marginBottom: 4 }}>
                        Mes Trajets
                    </h1>
                    <p style={{ color: '#9B8080', fontSize: 14 }}>Gérez tous vos trajets proposés</p>
                </div>
                <a href="/proposer-trajet" style={{
                    background: '#E26D5C', color: 'white', textDecoration: 'none',
                    borderRadius: 12, padding: '12px 22px',
                    fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 14
                }}>
                    + Nouveau trajet
                </a>
            </div>

            {error && <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 20px', color: '#C85A4A', fontWeight: 700, marginBottom: 20 }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 20px', color: '#3A6A1C', fontWeight: 700, marginBottom: 20 }}>✅ {success}</div>}

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 40 }}>🚗</div>
                    <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12 }}>Chargement...</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
                    {trajets.map(t => {
                        const st = statutStyle(t.statut);
                        return (
                            <div key={t.id} style={{
                                background: 'white', borderRadius: 20, padding: 22,
                                border: '2px solid rgba(71,45,48,0.1)',
                                boxShadow: '0 4px 20px rgba(71,45,48,0.08)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                                        <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 12px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 13 }}>
                                            {t.depart}
                                        </span>
                                        <span style={{ color: '#E26D5C', fontWeight: 900, fontSize: 16 }}>→</span>
                                        <span style={{ background: '#EFF2E0', color: '#472D30', padding: '5px 12px', borderRadius: 20, fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 13 }}>
                                            {t.destination}
                                        </span>
                                    </div>
                                    <span style={{ background: st.bg, color: st.color, fontSize: 10, fontWeight: 800, padding: '4px 10px', borderRadius: 20, whiteSpace: 'nowrap' }}>
                                        {st.label}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
                                    <span style={{ background: '#FFF5E6', border: '1.5px solid #E8D9C5', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#723D46', fontWeight: 700 }}>
                                        🕐 {new Date(t.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <span style={{ background: '#FFF5E6', border: '1.5px solid #E8D9C5', borderRadius: 8, padding: '4px 10px', fontSize: 11, color: '#723D46', fontWeight: 700 }}>
                                        💺 {t.placesDisponibles}/{t.placesTotal}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <span style={{ fontFamily: 'Nunito, sans-serif', fontSize: 24, fontWeight: 900, color: '#E26D5C' }}>
                                        {t.prix} DT
                                    </span>
                                    {t.statut === 'OUVERT' && (
                                        <button onClick={() => annuler(t.id)} style={{
                                            background: '#FAEAE8', border: '1.5px solid #E26D5C',
                                            color: '#C85A4A', borderRadius: 12, padding: '9px 16px',
                                            fontFamily: 'Nunito, sans-serif', fontWeight: 800,
                                            fontSize: 12, cursor: 'pointer'
                                        }}>Annuler</button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    {trajets.length === 0 && (
                        <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: 60 }}>
                            <div style={{ fontSize: 48 }}>🚗</div>
                            <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12, fontFamily: 'Nunito, sans-serif', fontSize: 18 }}>
                                Aucun trajet proposé
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default MesTrajets;