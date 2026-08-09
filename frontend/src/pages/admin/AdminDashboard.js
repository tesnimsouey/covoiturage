import React, { useState, useEffect } from 'react';
import API from '../../api/axios';

const AdminDashboard = () => {
    const [tab, setTab] = useState(0);
    const [users, setUsers] = useState([]);
    const [trajets, setTrajets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            const [u, t] = await Promise.all([API.get('/admin/users'), API.get('/admin/trajets')]);
            setUsers(Array.isArray(u.data) ? u.data : []);
            setTrajets(Array.isArray(t.data) ? t.data : []);
        } catch { setError('Erreur chargement'); }
        finally { setLoading(false); }
    };

    const action = async (endpoint, msg) => {
        try { await API.put(endpoint); setSuccess(msg); fetchData(); }
        catch (err) { setError(err.response?.data || 'Erreur'); }
    };

    const statutUser = (s) => ({
        'ACTIF': { bg: '#EEF5E8', color: '#3A6A1C' },
        'SUSPENDU': { bg: '#FFF5E6', color: '#C87A1A' },
        'BLOQUE': { bg: '#FAEAE8', color: '#C85A4A' },
    }[s] || { bg: '#F5F5F5', color: '#888' });

    const stats = [
        { label: 'Utilisateurs', value: users.length, icon: '👥', color: '#E26D5C' },
        { label: 'Trajets actifs', value: trajets.filter(t => t.statut === 'OUVERT').length, icon: '🚗', color: '#1B4FE4' },
        { label: 'Trajets complets', value: trajets.filter(t => t.statut === 'COMPLET').length, icon: '✅', color: '#5A8A3C' },
        { label: 'Total trajets', value: trajets.length, icon: '📊', color: '#723D46' },
    ];

    return (
        <div style={{ padding: '32px', maxWidth: 1200, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 28, color: '#472D30', marginBottom: 6 }}>
                Dashboard Admin
            </h1>
            <p style={{ color: '#9B8080', marginBottom: 28, fontSize: 14 }}>
                Vue d'ensemble de la plateforme CoVoiturage
            </p>

            {error && <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 20px', color: '#C85A4A', fontWeight: 700, marginBottom: 20 }}>⚠️ {error}</div>}
            {success && <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 20px', color: '#3A6A1C', fontWeight: 700, marginBottom: 20 }}>✅ {success}</div>}

            {/* STATS */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
                {stats.map(s => (
                    <div key={s.label} style={{
                        background: 'white', borderRadius: 20, padding: '20px 24px',
                        border: '2px solid rgba(71,45,48,0.1)',
                        boxShadow: '0 4px 20px rgba(71,45,48,0.08)',
                        borderLeft: `4px solid ${s.color}`
                    }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
                        <div style={{ fontFamily: 'Nunito, sans-serif', fontSize: 32, fontWeight: 900, color: s.color }}>
                            {s.value}
                        </div>
                        <div style={{ fontSize: 13, color: '#9B8080', fontWeight: 600, marginTop: 2 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                {['👥 Utilisateurs', '🚗 Trajets'].map((t, i) => (
                    <button key={i} onClick={() => setTab(i)} style={{
                        padding: '10px 24px', borderRadius: 12,
                        fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 14,
                        cursor: 'pointer', transition: 'all 0.2s',
                        background: tab === i ? '#E26D5C' : 'white',
                        color: tab === i ? 'white' : '#723D46',
                        border: tab === i ? 'none' : '2px solid rgba(71,45,48,0.1)'
                    }}>{t}</button>
                ))}
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: 60 }}>
                    <div style={{ fontSize: 40 }}>⏳</div>
                    <p style={{ color: '#723D46', fontWeight: 700, marginTop: 12 }}>Chargement...</p>
                </div>
            ) : (
                <div style={{ background: 'white', borderRadius: 20, border: '2px solid rgba(71,45,48,0.1)', overflow: 'hidden', boxShadow: '0 4px 20px rgba(71,45,48,0.08)' }}>
                    {tab === 0 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#E26D5C' }}>
                                    {['Nom', 'Email', 'Rôle', 'Statut', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((u, i) => {
                                    const st = statutUser(u.statut);
                                    return (
                                        <tr key={u.id} style={{ borderBottom: '1px solid rgba(71,45,48,0.08)', background: i % 2 === 0 ? 'white' : '#FFFAF5' }}>
                                            <td style={{ padding: '12px 16px', fontWeight: 700, color: '#472D30', fontSize: 13 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E26D5C', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 12 }}>
                                                        {u.name?.charAt(0)}
                                                    </div>
                                                    {u.name}
                                                </div>
                                            </td>
                                            <td style={{ padding: '12px 16px', color: '#723D46', fontSize: 13 }}>{u.email}</td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ background: u.role === 'CHAUFFEUR' ? '#E6EEFF' : u.role === 'ADMIN' ? '#FAEAE8' : '#EFF2E0', color: u.role === 'CHAUFFEUR' ? '#1B4FE4' : u.role === 'ADMIN' ? '#C85A4A' : '#3A6A1C', fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <span style={{ background: st.bg, color: st.color, fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20 }}>
                                                    {u.statut}
                                                </span>
                                            </td>
                                            <td style={{ padding: '12px 16px' }}>
                                                <div style={{ display: 'flex', gap: 6 }}>
                                                    {u.statut !== 'ACTIF' && (
                                                        <button onClick={() => action(`/admin/activer/${u.id}`, 'Activé')} style={{ background: '#EEF5E8', border: 'none', color: '#3A6A1C', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>Activer</button>
                                                    )}
                                                    {u.statut !== 'SUSPENDU' && (
                                                        <button onClick={() => action(`/admin/suspendre/${u.id}`, 'Suspendu')} style={{ background: '#FFF5E6', border: 'none', color: '#C87A1A', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>Suspendre</button>
                                                    )}
                                                    {u.statut !== 'BLOQUE' && (
                                                        <button onClick={() => action(`/admin/bloquer/${u.id}`, 'Bloqué')} style={{ background: '#FAEAE8', border: 'none', color: '#C85A4A', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>Bloquer</button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                    {tab === 1 && (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#1B4FE4' }}>
                                    {['Départ', 'Destination', 'Date', 'Prix', 'Places', 'Statut'].map(h => (
                                        <th key={h} style={{ padding: '14px 16px', textAlign: 'left', color: 'white', fontFamily: 'Nunito, sans-serif', fontWeight: 800, fontSize: 13 }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {trajets.map((t, i) => (
                                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(71,45,48,0.08)', background: i % 2 === 0 ? 'white' : '#FFFAF5' }}>
                                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#472D30', fontSize: 13 }}>{t.depart}</td>
                                        <td style={{ padding: '12px 16px', fontWeight: 800, color: '#472D30', fontSize: 13 }}>{t.destination}</td>
                                        <td style={{ padding: '12px 16px', color: '#723D46', fontSize: 12 }}>
                                            {new Date(t.date).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td style={{ padding: '12px 16px', fontFamily: 'Nunito, sans-serif', fontWeight: 900, color: '#E26D5C', fontSize: 14 }}>{t.prix} DT</td>
                                        <td style={{ padding: '12px 16px', color: '#723D46', fontSize: 13 }}>{t.placesDisponibles}/{t.placesTotal}</td>
                                        <td style={{ padding: '12px 16px' }}>
                                            <span style={{
                                                fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20,
                                                background: t.statut === 'OUVERT' ? '#EEF5E8' : t.statut === 'COMPLET' ? '#FFF5E6' : t.statut === 'TERMINE' ? '#E6EEFF' : '#FAEAE8',
                                                color: t.statut === 'OUVERT' ? '#3A6A1C' : t.statut === 'COMPLET' ? '#C87A1A' : t.statut === 'TERMINE' ? '#1B4FE4' : '#C85A4A'
                                            }}>
                                                {t.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;