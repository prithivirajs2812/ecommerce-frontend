import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FiUser, FiMail, FiLock, FiArrowRight, FiShoppingBag, FiGrid } from 'react-icons/fi';
import { register } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'USER' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        if (form.password !== form.confirm) return setError('Passwords do not match.');
        if (form.password.length < 6) return setError('Password must be at least 6 characters.');
        setLoading(true);
        try {
            const { data } = await register({ name: form.name, email: form.email, password: form.password, role: form.role });
            login({ name: data.name || form.name, email: form.email, role: data.role }, data.token);
            navigate(data.role === 'SELLER' ? '/seller' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper d-flex align-items-center" style={{ padding: '90px 0 40px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5} lg={4}>
                        <div className="glass-card" style={{ padding: '40px 36px' }}>
                            {/* Header */}
                            <div className="text-center mb-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>{form.role === 'SELLER' ? '🏪' : '🛍️'}</div>
                                <h2 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 800, marginBottom: 4 }}>Create Account</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Join LuxeCart for exclusive deals</p>
                                {/* Role toggle */}
                                <div className="d-flex gap-2 justify-content-center mt-3">
                                    {[['USER', FiShoppingBag, 'Buyer'], ['SELLER', FiGrid, 'Seller']].map(([role, Icon, label]) => (
                                        <button key={role} type="button" onClick={() => setForm(f => ({ ...f, role }))}
                                            style={{ background: form.role === role ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${form.role === role ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`, color: form.role === role ? '#f59e0b' : '#64748b', borderRadius: 10, padding: '7px 18px', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, transition: 'all 0.2s' }}>
                                            <Icon size={14} /> {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {error && <Alert variant="danger" className="py-2 px-3" style={{ fontSize: '0.87rem' }}>{error}</Alert>}

                            <form onSubmit={submit}>
                                <div className="mb-3">
                                    <label className="form-label">Full Name</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiUser style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="reg-name" name="name" value={form.name} onChange={handle} required
                                            className="form-control" placeholder="John Doe" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="reg-email" type="email" name="email" value={form.email} onChange={handle} required
                                            className="form-control" placeholder="you@email.com" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="reg-password" type="password" name="password" value={form.password} onChange={handle} required
                                            className="form-control" placeholder="Min 6 characters" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Confirm Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="reg-confirm" type="password" name="confirm" value={form.confirm} onChange={handle} required
                                            className="form-control" placeholder="Repeat password" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>

                                <button id="reg-submit" type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    style={{ padding: '13px' }} disabled={loading}>
                                    {loading ? <><span className="spinner-border spinner-border-sm" />Creating…</> : <><FiArrowRight />Create Account</>}
                                </button>
                            </form>

                            <p className="text-center mt-4" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Already have an account?{' '}
                                <Link to="/login" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Login →</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
