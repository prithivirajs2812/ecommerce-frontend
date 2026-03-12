import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FiArrowRight, FiShield, FiTruck, FiRefreshCw, FiStar } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

// Locally-defined demo products (shown while backend loads or offline)
const DEMO_PRODUCTS = [
    { id: '1', name: 'Premium Wireless Headphones', price: 129.99, category: 'Electronics', description: 'Crystal clear sound with active noise cancellation', rating: 4.5 },
    { id: '2', name: 'Minimalist Watch', price: 249.99, category: 'Accessories', description: 'Elegant timepiece with sapphire crystal glass', rating: 4.8 },
    { id: '3', name: 'Running Shoes Pro', price: 89.99, category: 'Footwear', description: 'Lightweight and responsive for peak performance', rating: 4.2 },
    { id: '4', name: 'Skincare Glow Set', price: 59.99, category: 'Beauty', description: 'Complete daily routine for radiant skin', rating: 4.6 },
    { id: '5', name: 'Polaroid Camera', price: 74.99, category: 'Electronics', description: 'Capture memories instantly in vivid color', rating: 4.3 },
    { id: '6', name: 'Leather Backpack', price: 199.99, category: 'Bags', description: 'Handcrafted full-grain leather for everyday use', rating: 4.7 },
    { id: '7', name: 'Smart Fitness Band', price: 49.99, category: 'Electronics', description: 'Track health metrics around the clock', rating: 4.1 },
    { id: '8', name: 'Scented Candle Set', price: 34.99, category: 'Home', description: 'Luxury fragrances to elevate your space', rating: 4.9 },
];

const CATEGORIES = [
    { name: 'Electronics', icon: '⚡', color: '#3b82f6' },
    { name: 'Fashion', icon: '👗', color: '#ec4899' },
    { name: 'Home', icon: '🏠', color: '#10b981' },
    { name: 'Beauty', icon: '✨', color: '#f59e0b' },
    { name: 'Sports', icon: '🏃', color: '#ef4444' },
    { name: 'Books', icon: '📚', color: '#8b5cf6' },
];

const PERKS = [
    { icon: FiTruck, title: 'Free Shipping', sub: 'On orders over $50' },
    { icon: FiRefreshCw, title: 'Easy Returns', sub: '30-day return policy' },
    { icon: FiShield, title: 'Secure Payments', sub: '256-bit SSL encrypted' },
    { icon: FiStar, title: 'Top Quality', sub: 'Curated premium products' },
];

export default function HomePage() {
    const [featured, setFeatured] = useState(DEMO_PRODUCTS.slice(0, 4));

    useEffect(() => {
        getProducts({ size: 8 })
            .then(r => { if (r.data?.length) setFeatured(r.data.slice(0, 4)); })
            .catch(() => { });
    }, []);

    return (
        <div className="page-wrapper">
            {/* ── Hero ── */}
            <section style={{
                background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
                padding: '80px 0 100px',
                position: 'relative',
                overflow: 'hidden',
            }}>
                {/* decorative blobs */}
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

                <Container>
                    <Row className="align-items-center g-5">
                        <Col lg={6} className="fade-in-up">
                            <span style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '6px 16px', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                🛍️ Premium E-Commerce
                            </span>
                            <h1 style={{ fontSize: 'clamp(2.5rem,5vw,3.8rem)', fontWeight: 800, lineHeight: 1.1, marginTop: 20, marginBottom: 20 }}>
                                Shop the{' '}
                                <span className="gradient-text">Future</span>
                                {' '}of Luxury
                            </h1>
                            <p style={{ color: '#94a3b8', fontSize: '1.15rem', lineHeight: 1.8, marginBottom: 36, maxWidth: 480 }}>
                                Discover curated premium products across all categories. From cutting-edge electronics to timeless fashion — all in one place.
                            </p>
                            <div className="d-flex gap-3 flex-wrap">
                                <Link to="/products">
                                    <button className="btn btn-primary d-flex align-items-center gap-2" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                                        Shop Now <FiArrowRight />
                                    </button>
                                </Link>
                                <Link to="/register">
                                    <button className="btn btn-outline-primary" style={{ padding: '14px 32px', fontSize: '1rem' }}>
                                        Join Free
                                    </button>
                                </Link>
                            </div>
                            {/* Stats */}
                            <div className="d-flex gap-4 mt-5">
                                {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, lbl]) => (
                                    <div key={lbl}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>{val}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.82rem' }}>{lbl}</div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col lg={6} className="fade-in-up-delay-2">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                {[
                                    { img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop', label: 'Watches' },
                                    { img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&h=200&fit=crop', label: 'Footwear' },
                                    { img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop', label: 'Audio' },
                                    { img: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=300&h=200&fit=crop', label: 'Cameras' },
                                ].map((item, i) => (
                                    <div key={i} className="glass-card" style={{ overflow: 'hidden', position: 'relative' }}>
                                        <img src={item.img} alt={item.label} style={{ width: '100%', height: 130, objectFit: 'cover', display: 'block' }} />
                                        <div style={{ padding: '10px 14px', fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* ── Perks Bar ── */}
            <section style={{ background: 'rgba(30,41,59,0.5)', padding: '40px 0', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <Container>
                    <Row className="g-3">
                        {PERKS.map((p, i) => (
                            <Col key={i} md={3} sm={6}>
                                <div className="d-flex align-items-center gap-3" style={{ padding: '12px 8px' }}>
                                    <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 12, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <p.icon color="#f59e0b" size={20} />
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.9rem' }}>{p.title}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.8rem' }}>{p.sub}</div>
                                    </div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* ── Categories ── */}
            <section style={{ padding: '80px 0 40px' }}>
                <Container>
                    <div className="text-center mb-5">
                        <h2 className="section-title">Shop by Category</h2>
                        <div className="gold-divider mx-auto" />
                        <p className="section-subtitle">Find exactly what you're looking for</p>
                    </div>
                    <Row className="g-3 justify-content-center">
                        {CATEGORIES.map((cat, i) => (
                            <Col key={i} xs={6} sm={4} md={2}>
                                <Link to={`/products?category=${cat.name}`} style={{ textDecoration: 'none' }}>
                                    <div className="glass-card text-center" style={{ padding: '24px 12px', cursor: 'pointer' }}>
                                        <div style={{ fontSize: '2rem', marginBottom: 10 }}>{cat.icon}</div>
                                        <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{cat.name}</div>
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* ── Featured Products ── */}
            <section style={{ padding: '40px 0 80px' }}>
                <Container>
                    <div className="d-flex align-items-end justify-content-between mb-5 flex-wrap gap-3">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <div className="gold-divider" />
                        </div>
                        <Link to="/products" className="btn btn-outline-primary d-flex align-items-center gap-2">
                            View All <FiArrowRight />
                        </Link>
                    </div>
                    <Row className="g-4">
                        {featured.map((p, i) => (
                            <Col key={p.id || i} sm={6} lg={3}>
                                <ProductCard product={p} index={i} />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* ── CTA Banner ── */}
            <section style={{ padding: '0 0 80px' }}>
                <Container>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.15) 0%, rgba(251,191,36,0.08) 100%)',
                        border: '1px solid rgba(245,158,11,0.25)', borderRadius: 24, padding: '60px 48px',
                        textAlign: 'center', position: 'relative', overflow: 'hidden',
                    }}>
                        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 16 }}>Get 20% Off Your First Order</h2>
                        <p style={{ color: '#94a3b8', marginBottom: 28, fontSize: '1.05rem' }}>Sign up today and unlock exclusive member deals, early access, and more.</p>
                        <Link to="/register">
                            <button className="btn btn-primary" style={{ padding: '14px 36px', fontSize: '1rem' }}>
                                Create Free Account
                            </button>
                        </Link>
                    </div>
                </Container>
            </section>
        </div>
    );
}
