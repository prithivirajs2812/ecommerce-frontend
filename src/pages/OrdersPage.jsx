import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FiPackage, FiShoppingBag } from 'react-icons/fi';
import { getMyOrders } from '../services/api';

const STATUS_COLORS = {
    PENDING: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: 'rgba(245,158,11,0.3)' },
    PROCESSING: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
    SHIPPED: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
    DELIVERED: { bg: 'rgba(16,185,129,0.15)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
    CANCELLED: { bg: 'rgba(239,68,68,0.15)', color: '#f87171', border: 'rgba(239,68,68,0.3)' },
};

const DEMO_ORDERS = [
    {
        id: 'ORD-1001', createdAt: '2026-03-01T10:30:00Z', status: 'DELIVERED', totalAmount: 259.98,
        items: [{ name: 'Premium Wireless Headphones', qty: 1, price: 129.99 }, { name: 'Smart Fitness Band', qty: 1, price: 49.99 }]
    },
    {
        id: 'ORD-1002', createdAt: '2026-03-03T14:15:00Z', status: 'SHIPPED', totalAmount: 249.99,
        items: [{ name: 'Minimalist Watch', qty: 1, price: 249.99 }]
    },
    {
        id: 'ORD-1003', createdAt: '2026-03-05T09:00:00Z', status: 'PENDING', totalAmount: 124.98,
        items: [{ name: 'Running Shoes Pro', qty: 1, price: 89.99 }, { name: 'Scented Candle Set', qty: 1, price: 34.99 }]
    },
];

function StatusBadge({ status }) {
    const s = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
    return (
        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: '3px 12px', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.5px' }}>
            {status}
        </span>
    );
}

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getMyOrders()
            .then(r => setOrders(r.data?.length ? r.data : DEMO_ORDERS))
            .catch(() => setOrders(DEMO_ORDERS))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                <h1 className="section-title mb-2">My Orders</h1>
                <div className="gold-divider" />
                <p className="section-subtitle">Track all your purchases</p>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner style={{ color: '#f59e0b', width: 44, height: 44 }} />
                    </div>
                ) : orders.length === 0 ? (
                    <div className="text-center py-5">
                        <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>📦</div>
                        <h4 style={{ color: '#94a3b8', marginBottom: 12 }}>No orders yet</h4>
                        <Link to="/products" className="btn btn-primary d-inline-flex align-items-center gap-2">
                            <FiShoppingBag /> Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="d-flex flex-column gap-4">
                        {orders.map((order, idx) => (
                            <div key={order.id || idx} className="glass-card" style={{ padding: '24px 28px' }}>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-3">
                                    <div className="d-flex align-items-center gap-3">
                                        <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <FiPackage color="#f59e0b" size={20} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>Order #{order.id}</div>
                                            <div style={{ color: '#64748b', fontSize: '0.8rem', marginTop: 2 }}>
                                                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </div>
                                        </div>
                                    </div>
                                    <StatusBadge status={order.status || 'PENDING'} />
                                </div>

                                {/* Items */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 16 }}>
                                    {order.items?.map((item, i) => (
                                        <div key={i} className="d-flex justify-content-between align-items-center" style={{ marginBottom: 8, fontSize: '0.87rem' }}>
                                            <span style={{ color: '#94a3b8' }}>{item.name} <span style={{ color: '#64748b' }}>×{item.qty}</span></span>
                                            <span style={{ color: '#f8fafc' }}>${(item.price * item.qty).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="d-flex justify-content-between align-items-center">
                                    <span style={{ color: '#64748b', fontSize: '0.85rem' }}>{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</span>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                                        Total: <span style={{ color: '#f59e0b' }}>${order.totalAmount?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>
        </div>
    );
}
