import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('PASSAGER');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault(); setLoading(true); setError('');
        try {
            await API.post('/auth/register', { name, email, password, role });
            setSuccess('Compte créé avec succès! Redirection...');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            setError(err.response?.data || "Erreur lors de l'inscription");
        } finally { setLoading(false); }
    };

    const inputStyle = {
        width: '100%', padding: '13px 16px',
        border: '2px solid #E8D9C5', borderRadius: 12,
        fontSize: 14, color: '#472D30', outline: 'none',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        background: '#FFFAF5', transition: 'border-color 0.2s'
    };

    return (
        <div style={{
            minHeight: '100vh', background: '#C9CBA3',
            display: 'flex', alignItems: 'center',
            justifyContent: 'center', padding: 20
        }}>
            <div style={{
                background: 'white', borderRadius: 28, padding: 48,
                width: '100%', maxWidth: 480,
                boxShadow: '0 20px 60px rgba(71,45,48,0.2)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 52, height: 52, background: '#E26D5C',
                        borderRadius: 16, display: 'flex', alignItems: 'center',
                        justifyContent: 'center', margin: '0 auto 14px'
                    }}>
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="white">
                            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                        </svg>
                    </div>
                    <h2 style={{ fontFamily: 'Nunito, sans-serif', fontSize: 28, fontWeight: 900, color: '#472D30', marginBottom: 6 }}>
                        Créer un compte
                    </h2>
                    <p style={{ color: '#9B8080', fontSize: 14 }}>Rejoignez CoVoiturage aujourd'hui</p>
                </div>

                {/* Role Toggle */}
                <div style={{
                    display: 'flex', background: '#EFF2E0',
                    borderRadius: 14, padding: 5, gap: 5, marginBottom: 24
                }}>
                    {['PASSAGER', 'CHAUFFEUR'].map(r => (
                        <button key={r} onClick={() => setRole(r)} style={{
                            flex: 1, padding: '10px', borderRadius: 10,
                            border: 'none', cursor: 'pointer', fontFamily: 'Nunito, sans-serif',
                            fontWeight: 800, fontSize: 13, transition: 'all 0.2s',
                            background: role === r ? '#E26D5C' : 'transparent',
                            color: role === r ? 'white' : '#723D46'
                        }}>
                            {r === 'PASSAGER' ? '👤 Passager' : '🚗 Chauffeur'}
                        </button>
                    ))}
                </div>

                {error && (
                    <div style={{ background: '#FAEAE8', border: '1.5px solid #E26D5C', borderRadius: 12, padding: '12px 16px', color: '#C85A4A', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
                        ⚠️ {error}
                    </div>
                )}
                {success && (
                    <div style={{ background: '#EEF5E8', border: '1.5px solid #5A8A3C', borderRadius: 12, padding: '12px 16px', color: '#3A6A1C', fontSize: 13, marginBottom: 20, fontWeight: 600 }}>
                        ✅ {success}
                    </div>
                )}

                <form onSubmit={handleRegister}>
                    {[
                        { label: 'Nom complet', type: 'text', val: name, set: setName, ph: 'Votre nom' },
                        { label: 'Email', type: 'email', val: email, set: setEmail, ph: 'votre@email.com' },
                        { label: 'Mot de passe', type: 'password', val: password, set: setPassword, ph: '••••••••' }
                    ].map(f => (
                        <div key={f.label} style={{ marginBottom: 18 }}>
                            <label style={{ display: 'block', fontSize: 11, fontWeight: 800, color: '#723D46', marginBottom: 7, letterSpacing: 1, textTransform: 'uppercase', fontFamily: 'Nunito, sans-serif' }}>
                                {f.label}
                            </label>
                            <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)}
                                required placeholder={f.ph} style={inputStyle}
                                onFocus={e => e.target.style.borderColor = '#E26D5C'}
                                onBlur={e => e.target.style.borderColor = '#E8D9C5'}
                            />
                        </div>
                    ))}
                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px',
                        background: loading ? '#ccc' : '#E26D5C',
                        color: 'white', border: 'none', borderRadius: 12,
                        fontFamily: 'Nunito, sans-serif', fontWeight: 900,
                        fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8
                    }}>
                        {loading ? 'Création...' : "S'inscrire →"}
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: 22, fontSize: 13, color: '#9B8080' }}>
                    Déjà un compte ?{' '}
                    <span onClick={() => navigate('/login')} style={{ color: '#E26D5C', fontWeight: 800, cursor: 'pointer', fontFamily: 'Nunito, sans-serif' }}>
                        Se connecter
                    </span>
                </p>
            </div>
        </div>
    );
};

export default Register;