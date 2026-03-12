import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FiShoppingCart, FiArrowLeft, FiStar, FiPackage, FiTruck } from 'react-icons/fi';
import { getProduct } from '../services/api';
import { useCart } from '../context/CartContext';

const DEMO = {
    id: '1', name: 'Premium Wireless Headphones', price: 129.99, category: 'Electronics',
    description: 'Experience crystal-clear audio with our flagship wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable ear cushions. Whether you\'re commuting, working, or unwinding — these headphones deliver a premium acoustic experience every time.',
    rating: 4.5, reviewCount: 248,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=500&fit=crop',
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        getProduct(id)
            .then(r => setProduct(r.data))
            .catch(() => setProduct({ ...DEMO, id }))
            .finally(() => setLoading(false));
    }, [id]);

    const handleAdd = () => {
        addToCart(product, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    };

    if (loading) return (
        <div className="page-wrapper d-flex align-items-center justify-content-center">
            <Spinner style={{ color: '#f59e0b', width: 48, height: 48 }} />
        </div>
    );

    const stars = '★'.repeat(Math.round(product.rating || 4)) + '☆'.repeat(5 - Math.round(product.rating || 4));

    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                {/* Back */}
                <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 32, fontSize: '0.9rem' }}>
                    <FiArrowLeft /> Back to Products
                </button>

                <Row className="g-5">
                    {/* Image */}
                    <Col lg={5}>
                        <div className="glass-card" style={{ overflow: 'hidden', padding: 0 }}>
                            <img
                                src={product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=500&fit=crop'}
                                alt={product.name}
                                style={{ width: '100%', height: 420, objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </Col>

                    {/* Details */}
                    <Col lg={7}>
                        {product.category && (
                            <span style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 20, padding: '4px 14px', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.5px' }}>
                                {product.category}
                            </span>
                        )}

                        <h1 style={{ fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 800, marginTop: 16, marginBottom: 10 }}>
                            {product.name}
                        </h1>

                        <div className="d-flex align-items-center gap-3 mb-4">
                            <span className="stars" style={{ fontSize: '0.95rem' }}>{stars}</span>
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>({product.reviewCount || 0} reviews)</span>
                        </div>

                        <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f59e0b', marginBottom: 24 }}>
                            ${product.price?.toFixed(2)}
                        </div>

                        <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: '1rem', marginBottom: 32 }}>
                            {product.description}
                        </p>

                        {/* Perks */}
                        <div className="d-flex gap-3 flex-wrap mb-4">
                            {[{ icon: FiTruck, text: 'Free Shipping' }, { icon: FiPackage, text: 'Secure Packaging' }].map(({ icon: Icon, text }, i) => (
                                <div key={i} style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: 10, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 6, color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <Icon color="#f59e0b" size={15} /> {text}
                                </div>
                            ))}
                        </div>

                        {/* Qty + Add */}
                        <div className="d-flex align-items-center gap-3 flex-wrap">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, overflow: 'hidden' }}>
                                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: 44, height: 44, fontSize: '1.2rem', cursor: 'pointer' }}>−</button>
                                <span style={{ color: '#f8fafc', fontWeight: 700, padding: '0 16px' }}>{qty}</span>
                                <button onClick={() => setQty(q => q + 1)} style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: 44, height: 44, fontSize: '1.2rem', cursor: 'pointer' }}>+</button>
                            </div>
                            <button
                                id={`detail-add-cart-${product.id}`}
                                onClick={handleAdd}
                                className="btn btn-primary d-flex align-items-center gap-2 flex-grow-1"
                                style={{ padding: '12px 28px', fontSize: '1rem', justifyContent: 'center' }}
                            >
                                {added ? '✓ Added to Cart!' : <><FiShoppingCart /> Add to Cart</>}
                            </button>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
