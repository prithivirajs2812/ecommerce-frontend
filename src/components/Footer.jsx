import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
    return (
        <footer style={{
            background: 'rgba(15,23,42,0.98)',
            borderTop: '1px solid rgba(245,158,11,0.2)',
            padding: '60px 0 30px',
            marginTop: 'auto',
        }}>
            <Container>
                <Row className="g-4 mb-4">
                    <Col lg={4}>
                        <h3 style={{ fontFamily: 'Playfair Display,serif', color: '#f59e0b', fontSize: '1.8rem', marginBottom: 12 }}>
                            LuxeCart
                        </h3>
                        <p style={{ color: '#94a3b8', lineHeight: 1.7 }}>
                            Your premium destination for high-quality products. Experience luxury shopping at its finest.
                        </p>
                        <div className="d-flex gap-3 mt-3">
                            {[FiInstagram, FiTwitter, FiFacebook].map((Icon, i) => (
                                <a key={i} href="#" style={{
                                    color: '#94a3b8',
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '10px',
                                    width: 40, height: 40,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    transition: 'all 0.2s',
                                }}
                                    onMouseEnter={e => { e.currentTarget.style.color = '#f59e0b'; e.currentTarget.style.borderColor = '#f59e0b'; }}
                                    onMouseLeave={e => { e.currentTarget.style.color = '#94a3b8'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                                >
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                    </Col>

                    <Col lg={2} md={4}>
                        <h6 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>
                            Shop
                        </h6>
                        {[['Products', '/products'], ['Cart', '/cart'], ['My Orders', '/orders']].map(([label, path]) => (
                            <div key={path} style={{ marginBottom: 10 }}>
                                <Link to={path} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#f59e0b'}
                                    onMouseLeave={e => e.target.style.color = '#64748b'}
                                >
                                    {label}
                                </Link>
                            </div>
                        ))}
                    </Col>

                    <Col lg={2} md={4}>
                        <h6 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>
                            Account
                        </h6>
                        {[['Login', '/login'], ['Register', '/register']].map(([label, path]) => (
                            <div key={path} style={{ marginBottom: 10 }}>
                                <Link to={path} style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', transition: 'color 0.2s' }}
                                    onMouseEnter={e => e.target.style.color = '#f59e0b'}
                                    onMouseLeave={e => e.target.style.color = '#64748b'}
                                >
                                    {label}
                                </Link>
                            </div>
                        ))}
                    </Col>

                    <Col lg={4} md={4}>
                        <h6 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.8rem' }}>
                            Contact
                        </h6>
                        <div className="d-flex align-items-center gap-2 mb-3" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            <FiMail color="#f59e0b" />
                            support@luxecart.com
                        </div>
                        <div className="d-flex align-items-center gap-2" style={{ color: '#64748b', fontSize: '0.9rem' }}>
                            <FiPhone color="#f59e0b" />
                            +1 (555) 000-1234
                        </div>
                    </Col>
                </Row>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 24, textAlign: 'center', color: '#334155', fontSize: '0.85rem' }}>
                    © {new Date().getFullYear()} LuxeCart. All rights reserved.
                </div>
            </Container>
        </footer>
    );
}
