import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMGS = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&h=100&fit=crop',
];

export default function CartPage() {
    const { cartItems, removeFromCart, updateQty, cartTotal, clearCart } = useCart();

    if (cartItems.length === 0) return (
        <div className="page-wrapper d-flex align-items-center">
            <Container>
                <div className="text-center" style={{ padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', marginBottom: 20 }}>🛒</div>
                    <h3 style={{ fontFamily: 'Playfair Display,serif', marginBottom: 12 }}>Your cart is empty</h3>
                    <p style={{ color: '#64748b', marginBottom: 28 }}>Add some products to get started!</p>
                    <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2">
                        <FiShoppingBag /> Browse Products
                    </Link>
                </div>
            </Container>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                <h1 className="section-title mb-2">Shopping Cart</h1>
                <div className="gold-divider" />
                <p className="section-subtitle">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>

                <Row className="g-4">
                    {/* Items */}
                    <Col lg={8}>
                        <div className="d-flex flex-column gap-3">
                            {cartItems.map((item, i) => (
                                <div key={item.id} className="glass-card d-flex align-items-center gap-3" style={{ padding: '18px 20px' }}>
                                    <img
                                        src={item.imageUrl || PLACEHOLDER_IMGS[i % PLACEHOLDER_IMGS.length]}
                                        alt={item.name}
                                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }}
                                    />
                                    <div className="flex-grow-1">
                                        <h6 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 4, fontFamily: 'Inter,sans-serif' }}>{item.name}</h6>
                                        {item.category && <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{item.category}</span>}
                                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f59e0b', marginTop: 6 }}>
                                            ${(item.price * item.qty).toFixed(2)}
                                        </div>
                                    </div>

                                    {/* Qty control */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, overflow: 'hidden' }}>
                                        <button onClick={() => updateQty(item.id, item.qty - 1)} style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: 36, height: 36, cursor: 'pointer', fontSize: '1.1rem' }}>−</button>
                                        <span style={{ color: '#f8fafc', fontWeight: 700, padding: '0 12px', minWidth: 24, textAlign: 'center' }}>{item.qty}</span>
                                        <button onClick={() => updateQty(item.id, item.qty + 1)} style={{ background: 'transparent', border: 'none', color: '#f8fafc', width: 36, height: 36, cursor: 'pointer', fontSize: '1.1rem' }}>+</button>
                                    </div>

                                    <button onClick={() => removeFromCart(item.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 8, color: '#f87171', padding: '8px 10px', cursor: 'pointer', flexShrink: 0 }}>
                                        <FiTrash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button onClick={clearCart} style={{ background: 'transparent', border: 'none', color: '#ef4444', marginTop: 16, cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                            <FiTrash2 size={14} /> Clear Cart
                        </button>
                    </Col>

                    {/* Summary */}
                    <Col lg={4}>
                        <div className="glass-card" style={{ padding: '28px 24px', position: 'sticky', top: 100 }}>
                            <h5 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, marginBottom: 20 }}>Order Summary</h5>

                            <div className="d-flex justify-content-between mb-2" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                <span>Subtotal ({cartItems.reduce((s, i) => s + i.qty, 0)} items)</span>
                                <span>${cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                <span>Shipping</span>
                                <span style={{ color: '#10b981' }}>{cartTotal > 50 ? 'FREE' : '$5.99'}</span>
                            </div>
                            {cartTotal <= 50 && (
                                <div style={{ background: 'rgba(245,158,11,0.07)', borderRadius: 8, padding: '8px 12px', fontSize: '0.78rem', color: '#94a3b8', marginBottom: 8 }}>
                                    Add <strong style={{ color: '#f59e0b' }}>${(50 - cartTotal).toFixed(2)}</strong> more for free shipping!
                                </div>
                            )}
                            <hr style={{ borderColor: 'rgba(255,255,255,0.08)', margin: '16px 0' }} />
                            <div className="d-flex justify-content-between mb-4" style={{ fontWeight: 800, fontSize: '1.1rem' }}>
                                <span>Total</span>
                                <span style={{ color: '#f59e0b' }}>${(cartTotal + (cartTotal > 50 ? 0 : 5.99)).toFixed(2)}</span>
                            </div>

                            <Link to="/checkout" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2" style={{ padding: '13px' }}>
                                Proceed to Checkout <FiArrowRight />
                            </Link>
                            <Link to="/products" style={{ display: 'block', textAlign: 'center', color: '#64748b', fontSize: '0.85rem', marginTop: 14, textDecoration: 'none' }}>
                                ← Continue Shopping
                            </Link>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}
