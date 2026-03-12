import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import { FiCheckCircle, FiCreditCard, FiMapPin, FiUser } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/api';
import { useRazorpay } from 'react-razorpay';
import axios from 'axios';

export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const { Razorpay } = useRazorpay();

    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        address: '',
        city: '',
        zip: '',
        country: '',
        card: '',
        expiry: '',
        cvv: '',
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const shipping = cartTotal > 50 ? 0 : 5.99;
    const total = cartTotal + shipping;

    const submit = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return setError('Your cart is empty.');
        setError('');
        setLoading(true);

        try {
            // 1. Create Order on Backend
            const { data } = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'}/payments/create-order`, {
                amount: total
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // assuming token is in localStorage
                }
            });

            // 2. Initialize Razorpay Options
            const options = {
                key: 'rzp_test_YOUR_KEY_ID', // Replace with your actual key in production/env
                amount: Math.round(total * 100).toString(),
                currency: "INR",
                name: "Your Store",
                description: "Test Transaction",
                order_id: data.orderId,
                handler: async function (response) {
                    try {
                        const payload = {
                            items: cartItems.map(i => ({ productId: i.id, name: i.name, price: i.price, qty: i.qty })),
                            shippingAddress: `${form.address}, ${form.city}, ${form.zip}, ${form.country}`,
                            totalAmount: total,
                            paymentId: response.razorpay_payment_id
                        };
                        await placeOrder(payload).catch(() => { });
                        clearCart();
                        setSuccess(true);
                        setTimeout(() => navigate('/orders'), 3000);
                    } catch {
                        setError('Order placement failed after payment.');
                    }
                },
                prefill: {
                    name: form.name,
                    email: form.email,
                },
                theme: {
                    color: "#f59e0b",
                },
            };

            const rzp = new Razorpay(options);

            rzp.on('payment.failed', function (response) {
                setError(`Payment Failed: ${response.error.description}`);
            });

            rzp.open();

        } catch {
            setError('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) return (
        <div className="page-wrapper d-flex align-items-center">
            <Container>
                <div className="text-center" style={{ padding: '60px 20px' }}>
                    <div style={{ fontSize: '4rem', color: '#10b981', marginBottom: 20 }}><FiCheckCircle /></div>
                    <h2 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 800, marginBottom: 12, color: '#10b981' }}>Order Placed!</h2>
                    <p style={{ color: '#94a3b8', marginBottom: 8 }}>Thank you for your purchase. Redirecting to your orders…</p>
                </div>
            </Container>
        </div>
    );

    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                <h1 className="section-title mb-2">Checkout</h1>
                <div className="gold-divider" />
                <p className="section-subtitle">Complete your order</p>

                {error && <Alert variant="danger">{error}</Alert>}

                <form onSubmit={submit}>
                    <Row className="g-4">
                        {/* Left column */}
                        <Col lg={7}>
                            {/* Shipping */}
                            <div className="glass-card p-4 mb-4">
                                <h5 className="d-flex align-items-center gap-2 mb-4" style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                                    <FiMapPin color="#f59e0b" /> Shipping Information
                                </h5>
                                <Row className="g-3">
                                    <Col md={6}>
                                        <label className="form-label">Full Name</label>
                                        <input id="co-name" name="name" value={form.name} onChange={handle} required className="form-control" placeholder="John Doe" />
                                    </Col>
                                    <Col md={6}>
                                        <label className="form-label">Email</label>
                                        <input id="co-email" type="email" name="email" value={form.email} onChange={handle} required className="form-control" placeholder="you@email.com" />
                                    </Col>
                                    <Col xs={12}>
                                        <label className="form-label">Address</label>
                                        <input id="co-address" name="address" value={form.address} onChange={handle} required className="form-control" placeholder="123 Main Street" />
                                    </Col>
                                    <Col md={4}>
                                        <label className="form-label">City</label>
                                        <input id="co-city" name="city" value={form.city} onChange={handle} required className="form-control" placeholder="New York" />
                                    </Col>
                                    <Col md={4}>
                                        <label className="form-label">ZIP Code</label>
                                        <input id="co-zip" name="zip" value={form.zip} onChange={handle} required className="form-control" placeholder="10001" />
                                    </Col>
                                    <Col md={4}>
                                        <label className="form-label">Country</label>
                                        <input id="co-country" name="country" value={form.country} onChange={handle} required className="form-control" placeholder="United States" />
                                    </Col>
                                </Row>
                            </div>

                            {/* Payment */}
                            <div className="glass-card p-4">
                                <h5 className="d-flex align-items-center gap-2 mb-4" style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                                    <FiCreditCard color="#f59e0b" /> Payment Method
                                </h5>
                                <div style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '16px', marginBottom: 20, color: '#f8fafc', fontSize: '1rem' }}>
                                    <p className="mb-0">You will be redirected to Razorpay securely to complete your payment.</p>
                                </div>
                            </div>
                        </Col>

                        {/* Right: Summary */}
                        <Col lg={5}>
                            <div className="glass-card p-4" style={{ position: 'sticky', top: 100 }}>
                                <h5 style={{ fontFamily: 'Playfair Display,serif', fontWeight: 700, marginBottom: 20 }}>Order Summary</h5>
                                <div className="d-flex flex-column gap-2 mb-3">
                                    {cartItems.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between" style={{ fontSize: '0.87rem' }}>
                                            <span style={{ color: '#94a3b8' }}>{item.name} <span style={{ color: '#64748b' }}>×{item.qty}</span></span>
                                            <span style={{ color: '#f8fafc' }}>${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                                <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                                <div className="d-flex justify-content-between mb-2" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <span>Subtotal</span><span>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2" style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                                    <span>Shipping</span>
                                    <span style={{ color: shipping === 0 ? '#10b981' : 'inherit' }}>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                                </div>
                                <hr style={{ borderColor: 'rgba(255,255,255,0.08)' }} />
                                <div className="d-flex justify-content-between mb-5" style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                                    <span>Total</span>
                                    <span style={{ color: '#f59e0b' }}>${total.toFixed(2)}</span>
                                </div>

                                <button id="co-submit" type="submit" className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2"
                                    style={{ padding: '14px', fontSize: '1rem' }} disabled={loading || cartItems.length === 0}>
                                    {loading ? <><span className="spinner-border spinner-border-sm" />Placing Order…</> : <><FiCheckCircle />Place Order</>}
                                </button>
                            </div>
                        </Col>
                    </Row>
                </form>
            </Container>
        </div>
    );
}

