import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Modal } from 'react-bootstrap';
import { FiPlus, FiEdit2, FiTrash2, FiPackage, FiShoppingBag, FiCheckCircle } from 'react-icons/fi';
import {
    getProducts, createProduct, updateProduct, deleteProduct,
    getAllOrders, updateOrderStatus
} from '../services/api';

const STATUS_OPTIONS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
const STATUS_COLORS = {
    PENDING: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b' },
    PROCESSING: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    SHIPPED: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    DELIVERED: { bg: 'rgba(16,185,129,0.15)', color: '#34d399' },
    CANCELLED: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
};
const EMPTY_FORM = { name: '', description: '', price: '', category: '', imageUrl: '', stock: '' };

function StatusBadge({ status }) {
    const s = STATUS_COLORS[status] || STATUS_COLORS.PENDING;
    return (
        <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.color}33`, borderRadius: 20, padding: '3px 12px', fontSize: '0.72rem', fontWeight: 700 }}>
            {status}
        </span>
    );
}

export default function SellerDashboard() {
    const [tab, setTab] = useState('products');
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Product form / modal
    const [showModal, setShowModal] = useState(false);
    const [editProduct, setEditProduct] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    // Load data based on active tab
    useEffect(() => {
        setLoading(true);
        setError('');
        if (tab === 'products') {
            getProducts()
                .then(r => setProducts(r.data || []))
                .catch(() => setError('Failed to load products.'))
                .finally(() => setLoading(false));
        } else {
            getAllOrders()
                .then(r => setOrders(r.data || []))
                .catch(() => setError('Failed to load orders. Make sure you are logged in as a Seller.'))
                .finally(() => setLoading(false));
        }
    }, [tab]);

    // ── Product modal helpers ──────────────────
    const openAdd = () => {
        setEditProduct(null);
        setForm(EMPTY_FORM);
        setShowModal(true);
    };

    const openEdit = (p) => {
        setEditProduct(p);
        setForm({
            name: p.name || '', description: p.description || '',
            price: p.price || '', category: p.category || '',
            imageUrl: p.imageUrl || '', stock: p.stock || '',
        });
        setShowModal(true);
    };

    const handleFormChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSave = async () => {
        setSaving(true); setError('');
        try {
            const payload = { ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0 };
            if (editProduct) {
                const { data } = await updateProduct(editProduct.id, payload);
                setProducts(prev => prev.map(p => p.id === editProduct.id ? data : p));
                setSuccess('Product updated successfully!');
            } else {
                const { data } = await createProduct(payload);
                setProducts(prev => [...prev, data]);
                setSuccess('Product added successfully!');
            }
            setShowModal(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Save failed. Ensure you are logged in as Seller.');
        } finally { setSaving(false); }
        setTimeout(() => setSuccess(''), 3000);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this product?')) return;
        try {
            await deleteProduct(id);
            setProducts(prev => prev.filter(p => p.id !== id));
            setSuccess('Product deleted.');
            setTimeout(() => setSuccess(''), 2500);
        } catch {
            setError('Delete failed.');
        }
    };

    // ── Order status update ────────────────────
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            const { data } = await updateOrderStatus(orderId, newStatus);
            setOrders(prev => prev.map(o => o.id === orderId ? data : o));
            setSuccess(`Order ${orderId.slice(-6)} → ${newStatus}`);
            setTimeout(() => setSuccess(''), 3000);
        } catch {
            setError('Status update failed.');
        }
    };

    // ── Render ──────────────────────────────────
    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                {/* Header */}
                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
                    <div>
                        <h1 className="section-title mb-1">Seller Dashboard</h1>
                        <div className="gold-divider" />
                    </div>
                    {tab === 'products' && (
                        <button id="add-product-btn" onClick={openAdd} className="btn btn-primary d-flex align-items-center gap-2">
                            <FiPlus /> Add Product
                        </button>
                    )}
                </div>

                {/* Alerts */}
                {success && <Alert variant="success" className="py-2">{success}</Alert>}
                {error && <Alert variant="danger" className="py-2">{error}</Alert>}

                {/* Tabs */}
                <div className="d-flex gap-2 mb-4">
                    {[['products', FiShoppingBag, 'Manage Products'], ['orders', FiPackage, 'Manage Orders']].map(([key, Icon, label]) => (
                        <button key={key} onClick={() => setTab(key)} style={{
                            background: tab === key ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${tab === key ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                            color: tab === key ? '#f59e0b' : '#94a3b8',
                            borderRadius: 10, padding: '8px 20px', fontWeight: 600, cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s',
                        }}>
                            <Icon size={16} /> {label}
                        </button>
                    ))}
                </div>

                {/* Loading */}
                {loading ? (
                    <div className="text-center py-5"><Spinner style={{ color: '#f59e0b', width: 44, height: 44 }} /></div>
                ) : tab === 'products' ? (
                    /* ── Products Table ── */
                    <div className="glass-card" style={{ overflow: 'hidden' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                                    {['Product', 'Category', 'Price', 'Stock', 'Rating', 'Actions'].map(h => (
                                        <th key={h} style={{ padding: '14px 20px', color: '#64748b', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', textAlign: 'left' }}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {products.length === 0 ? (
                                    <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No products yet. Click "Add Product" to get started.</td></tr>
                                ) : products.map((p, i) => (
                                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <td style={{ padding: '14px 20px' }}>
                                            <div className="d-flex align-items-center gap-3">
                                                {p.imageUrl && <img src={p.imageUrl} alt={p.name} style={{ width: 44, height: 44, objectFit: 'cover', borderRadius: 8 }} />}
                                                <div>
                                                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{p.name}</div>
                                                    <div style={{ color: '#64748b', fontSize: '0.78rem' }}>{p.description?.substring(0, 45)}…</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ padding: '14px 20px', color: '#94a3b8', fontSize: '0.85rem' }}>{p.category || '—'}</td>
                                        <td style={{ padding: '14px 20px', color: '#f59e0b', fontWeight: 700 }}>${p.price?.toFixed(2)}</td>
                                        <td style={{ padding: '14px 20px', color: p.stock > 0 ? '#34d399' : '#f87171', fontWeight: 600 }}>{p.stock}</td>
                                        <td style={{ padding: '14px 20px', color: '#f59e0b' }}>{'★'.repeat(Math.round(p.rating || 0))}</td>
                                        <td style={{ padding: '14px 20px' }}>
                                            <div className="d-flex gap-2">
                                                <button id={`edit-product-${p.id}`} onClick={() => openEdit(p)} style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 8, color: '#60a5fa', padding: '6px 10px', cursor: 'pointer' }}>
                                                    <FiEdit2 size={14} />
                                                </button>
                                                <button id={`delete-product-${p.id}`} onClick={() => handleDelete(p.id)} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#f87171', padding: '6px 10px', cursor: 'pointer' }}>
                                                    <FiTrash2 size={14} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    /* ── Orders Table ── */
                    <div className="d-flex flex-column gap-3">
                        {orders.length === 0 ? (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '3rem', marginBottom: 12 }}>📦</div>
                                <p style={{ color: '#64748b' }}>No orders yet.</p>
                            </div>
                        ) : orders.map((order) => (
                            <div key={order.id} className="glass-card" style={{ padding: '20px 24px' }}>
                                <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                    <div>
                                        <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.92rem' }}>Order #{order.id?.slice(-8).toUpperCase()}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 2 }}>
                                            {new Date(order.createdAt).toLocaleString()} · {order.items?.length || 0} items · <strong style={{ color: '#f59e0b' }}>${order.totalAmount?.toFixed(2)}</strong>
                                        </div>
                                        {order.shippingAddress && (
                                            <div style={{ color: '#64748b', fontSize: '0.78rem', marginTop: 2 }}>📍 {order.shippingAddress}</div>
                                        )}
                                    </div>
                                    <div className="d-flex align-items-center gap-3">
                                        <StatusBadge status={order.status} />
                                        {/* Status dropdown */}
                                        <select
                                            id={`status-${order.id}`}
                                            value={order.status}
                                            onChange={e => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                background: 'rgba(30,41,59,0.8)', border: '1px solid rgba(245,158,11,0.3)',
                                                borderRadius: 8, color: '#f8fafc', padding: '6px 12px', fontSize: '0.83rem',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                </div>
                                {/* Items summary */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 14, paddingTop: 12, display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {order.items?.map((item, i) => (
                                        <span key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '3px 10px', fontSize: '0.78rem', color: '#94a3b8' }}>
                                            {item.name} ×{item.qty}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Container>

            {/* ── Add/Edit Product Modal ── */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                <Modal.Header style={{ background: 'var(--secondary)', border: '1px solid rgba(245,158,11,0.2)', borderBottom: 'none' }}>
                    <Modal.Title style={{ color: '#f8fafc', fontFamily: 'Playfair Display,serif', fontWeight: 700 }}>
                        {editProduct ? '✏️ Edit Product' : '➕ Add New Product'}
                    </Modal.Title>
                    <button onClick={() => setShowModal(false)} style={{ background: 'transparent', border: 'none', color: '#64748b', fontSize: '1.3rem', cursor: 'pointer' }}>✕</button>
                </Modal.Header>
                <Modal.Body style={{ background: 'var(--secondary)', border: '1px solid rgba(245,158,11,0.2)', borderTop: 'none', borderBottom: 'none' }}>
                    {error && <Alert variant="danger" className="py-2 mb-3">{error}</Alert>}
                    <Row className="g-3">
                        <Col md={6}>
                            <label className="form-label">Product Name *</label>
                            <input id="form-name" name="name" value={form.name} onChange={handleFormChange} required className="form-control" placeholder="e.g. Premium Headphones" />
                        </Col>
                        <Col md={6}>
                            <label className="form-label">Category</label>
                            <input id="form-category" name="category" value={form.category} onChange={handleFormChange} className="form-control" placeholder="e.g. Electronics" />
                        </Col>
                        <Col md={6}>
                            <label className="form-label">Price ($) *</label>
                            <input id="form-price" name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleFormChange} required className="form-control" placeholder="e.g. 99.99" />
                        </Col>
                        <Col md={6}>
                            <label className="form-label">Stock</label>
                            <input id="form-stock" name="stock" type="number" min="0" value={form.stock} onChange={handleFormChange} className="form-control" placeholder="e.g. 50" />
                        </Col>
                        <Col xs={12}>
                            <label className="form-label">Image URL</label>
                            <input id="form-imageUrl" name="imageUrl" value={form.imageUrl} onChange={handleFormChange} className="form-control" placeholder="https://..." />
                        </Col>
                        <Col xs={12}>
                            <label className="form-label">Description</label>
                            <textarea id="form-description" name="description" value={form.description} onChange={handleFormChange} className="form-control" rows={3} placeholder="Describe the product…" />
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer style={{ background: 'var(--secondary)', border: '1px solid rgba(245,158,11,0.2)', borderTop: 'none' }}>
                    <button onClick={() => setShowModal(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '9px 20px', color: '#94a3b8', cursor: 'pointer' }}>
                        Cancel
                    </button>
                    <button id="form-save" onClick={handleSave} disabled={saving || !form.name || !form.price} className="btn btn-primary d-flex align-items-center gap-2" style={{ padding: '9px 24px' }}>
                        {saving ? <><span className="spinner-border spinner-border-sm" />Saving…</> : <><FiCheckCircle />{editProduct ? 'Update Product' : 'Add Product'}</>}
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
