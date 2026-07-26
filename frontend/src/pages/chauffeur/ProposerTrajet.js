import React, { useState } from 'react';
import API from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const ProposerTrajet = () => {
    const { user } = useAuth();
    const [form, setForm] = useState({ depart: '', destination: '', date: '', prix: '', placesTotal: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            await API.post('/trajets', {
                chauffeurId: user.id,
                depart: form.depart, destination: form.destination,
                date: form.date, prix: parseFloat(form.prix),
                placesTotal: parseInt(form.placesTotal)
            });
            setSuccess('Trajet proposé avec succès!');
            setForm({ depart: '', destination: '', date: '', prix: '', placesTotal: '' });
        } catch (err) { setError(err.response?.data || 'Erreur'); }
        finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '13px 16px',
        border: '2px solid #E8D9C5', borderRadius: 12,
        fontSize: 14, color: '#472D30', outline: 'none',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: '#FFFAF5', marginBottom: 18
    };

    const fields = [
        { label: '🏙 Ville de départ', key: 'depart', type: 'text', ph: 'Ex: Sousse' },
        { label: '📍 Destination', key: 'destination', type: 'text', ph: 'Ex: Tunis' },
        { label: '📅 Date et heure', key: 'date', type: 'datetime-local', ph: '' },
        { label: '💰 Prix par place (DT)', key: 'prix', type: 'number', ph: 'Ex: 12' },
        { label: '💺 Nombre de places', key: 'placesTotal', type: 'number', ph: 'Ex: 3' },
    ];

    return (
        <div style={{ padding: '32px', maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 28, color: '#472D30', marginBottom: 8 }}>
                Proposer un Trajet
            </h1>
            <p style={{ color: '#9B8080', marginBottom: 28, fontSize: 14 }}>
                Partagez votre trajet avec d'autres voyageurs
            </p>

            <div style={{
                background: 'white', borderRadius: 24, padding: 36,
                border: '2px solid rgba(71,45,48,0.1)',
                boxShadow: '0 8px 32px rgba(71,45,48,0.1)'
            }}>
                {error && <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 16px', color: '#C85A4A', fontWeight: 700, marginBottom: 20 }}>⚠️ {error}</div>}
                {success && <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 16px', color: '#3A6A1C', fontWeight: 700, marginBottom: 20 }}>✅ {success}</div>}

                <form onSubmit={handleSubmit}>
                    {fields.map(f => (
                        <div key={f.key}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#723D46', marginBottom: 7, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Nunito, sans-serif' }}>
                                {f.label}
                            </label>
                            <input type={f.type} value={form[f.key]} placeholder={f.ph}
                                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                                required style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#E26D5C'}
                                onBlur={e => e.target.style.borderColor = '#E8D9C5'}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '15px',
                        background: loading ? '#ccc' : '#E26D5C',
                        color: 'white', border: 'none', borderRadius: 12,
                        fontFamily: 'Nunito, sans-serif', fontWeight: 900,
                        fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8
                    }}>
                        {loading ? 'Création...' : '🚗 Proposer le trajet →'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProposerTrajet;