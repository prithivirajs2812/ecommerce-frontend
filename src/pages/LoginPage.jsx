import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import { login as apiLogin } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const submit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await apiLogin(form);
            login({ name: data.name, email: form.email, role: data.role }, data.token);
            navigate(data.role === 'SELLER' ? '/seller' : '/');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid email or password.');
        } finally { setLoading(false); }
    };

    return (
        <div className="page-wrapper d-flex align-items-center" style={{ padding: '90px 0 40px' }}>
            <Container>
                <Row className="justify-content-center">
                    <Col md={5} lg={4}>
                        <div className="glass-card" style={{ padding: '40px 36px' }}>
                            <div className="text-center mb-4">
                                <div style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔐</div>
                                <h2 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 800, marginBottom: 4 }}>Welcome Back</h2>
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Sign in to continue shopping</p>
                            </div>

                            {error && <Alert variant="danger" className="py-2 px-3" style={{ fontSize: '0.87rem' }}>{error}</Alert>}

                            <form onSubmit={submit}>
                                <div className="mb-3">
                                    <label className="form-label">Email Address</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiMail style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="login-email" type="email" name="email" value={form.email} onChange={handle} required
                                            className="form-control" placeholder="you@email.com" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label">Password</label>
                                    <div style={{ position: 'relative' }}>
                                        <FiLock style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                        <input id="login-password" type="password" name="password" value={form.password} onChange={handle} required
                                            className="form-control" placeholder="Your password" style={{ paddingLeft: 40 }} />
                                    </div>
                                </div>

                                <button id="login-submit" type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    style={{ padding: '13px' }} disabled={loading}>
                                    {loading ? <><span className="spinner-border spinner-border-sm" />Signing in…</> : <><FiArrowRight />Sign In</>}
                                </button>
                            </form>



                            <p className="text-center mt-4" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                                Don't have an account?{' '}
                                <Link to="/register" style={{ color: '#f59e0b', fontWeight: 600, textDecoration: 'none' }}>Register →</Link>
                            </p>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
