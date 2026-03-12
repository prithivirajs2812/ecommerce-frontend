import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { FiSearch, FiFilter } from 'react-icons/fi';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/api';

const DEMO_PRODUCTS = [
    { id: '1', name: 'Premium Wireless Headphones', price: 129.99, category: 'Electronics', description: 'Crystal clear sound with active noise cancellation and 30-hour battery', rating: 4.5, reviewCount: 248 },
    { id: '2', name: 'Minimalist Watch', price: 249.99, category: 'Accessories', description: 'Elegant stainless steel with sapphire crystal glass and Swiss movement', rating: 4.8, reviewCount: 126 },
    { id: '3', name: 'Running Shoes Pro', price: 89.99, category: 'Footwear', description: 'Ultra-lightweight foam sole for peak running performance', rating: 4.2, reviewCount: 334 },
    { id: '4', name: 'Skincare Glow Set', price: 59.99, category: 'Beauty', description: 'Complete daily routine with vitamin C serum, moisturizer, and SPF', rating: 4.6, reviewCount: 92 },
    { id: '5', name: 'Polaroid Camera', price: 74.99, category: 'Electronics', description: 'Capture vibrant instant photos with double exposure mode', rating: 4.3, reviewCount: 181 },
    { id: '6', name: 'Leather Backpack', price: 199.99, category: 'Bags', description: 'Full-grain Italian leather with padded laptop sleeve', rating: 4.7, reviewCount: 67 },
    { id: '7', name: 'Smart Fitness Band', price: 49.99, category: 'Electronics', description: 'Track heart rate, sleep, and workouts with 7-day battery life', rating: 4.1, reviewCount: 412 },
    { id: '8', name: 'Scented Candle Set', price: 34.99, category: 'Home', description: 'Three signature fragrances in hand-poured soy wax candles', rating: 4.9, reviewCount: 55 },
    { id: '9', name: 'Sunglasses Elite', price: 119.99, category: 'Accessories', description: 'Polarized UV400 lenses in a titanium frame', rating: 4.4, reviewCount: 203 },
    { id: '10', name: 'Yoga Mat Premium', price: 44.99, category: 'Sports', description: '6mm non-slip natural rubber with alignment lines', rating: 4.6, reviewCount: 289 },
    { id: '11', name: 'Stainless Water Bottle', price: 29.99, category: 'Sports', description: '24-hour cold / 12-hour hot with leak-proof lid', rating: 4.5, reviewCount: 550 },
    { id: '12', name: 'Desk Plant Trio', price: 39.99, category: 'Home', description: 'Low-maintenance succulents in minimalist ceramic pots', rating: 4.8, reviewCount: 38 },
];

const CATEGORIES = ['All', 'Electronics', 'Accessories', 'Footwear', 'Beauty', 'Bags', 'Sports', 'Home'];
const SORT_OPTIONS = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating', label: 'Top Rated' },
];

export default function ProductsPage() {
    const [searchParams] = useSearchParams();
    const initialCat = searchParams.get('category') || 'All';

    const [products, setProducts] = useState(DEMO_PRODUCTS);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState(initialCat);
    const [sort, setSort] = useState('featured');

    useEffect(() => {
        setLoading(true);
        getProducts()
            .then(r => { if (r.data?.length) setProducts(r.data); })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filtered = products
        .filter(p => category === 'All' || p.category === category)
        .filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (sort === 'price-asc') return a.price - b.price;
            if (sort === 'price-desc') return b.price - a.price;
            if (sort === 'rating') return (b.rating || 0) - (a.rating || 0);
            return 0;
        });

    return (
        <div className="page-wrapper">
            <Container style={{ paddingBottom: 80 }}>
                {/* Header */}
                <div className="text-center mb-5 pt-2">
                    <h1 className="section-title">All Products</h1>
                    <div className="gold-divider mx-auto" />
                    <p className="section-subtitle">Explore our curated collection of premium items</p>
                </div>

                {/* Search + Filters */}
                <div className="glass-card p-4 mb-5">
                    <Row className="g-3 align-items-center">
                        <Col md={5}>
                            <div style={{ position: 'relative' }}>
                                <FiSearch style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <input
                                    id="product-search"
                                    className="form-control"
                                    placeholder="Search products…"
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    style={{ paddingLeft: 40 }}
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="d-flex gap-2 flex-wrap">
                                {CATEGORIES.map(cat => (
                                    <button
                                        key={cat}
                                        onClick={() => setCategory(cat)}
                                        style={{
                                            background: category === cat ? 'rgba(245,158,11,0.2)' : 'rgba(255,255,255,0.04)',
                                            border: `1px solid ${category === cat ? '#f59e0b' : 'rgba(255,255,255,0.1)'}`,
                                            color: category === cat ? '#f59e0b' : '#94a3b8',
                                            borderRadius: 8, padding: '5px 14px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer',
                                            transition: 'all 0.2s',
                                        }}
                                    >
                                        {cat}
                                    </button>
                                ))}
                            </div>
                        </Col>
                        <Col md={3}>
                            <div style={{ position: 'relative' }}>
                                <FiFilter style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                                <select
                                    id="product-sort"
                                    className="form-select"
                                    value={sort}
                                    onChange={e => setSort(e.target.value)}
                                    style={{ paddingLeft: 40 }}
                                >
                                    {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                </select>
                            </div>
                        </Col>
                    </Row>
                </div>

                {/* Results count */}
                <p style={{ color: '#64748b', marginBottom: 24, fontSize: '0.9rem' }}>
                    Showing <strong style={{ color: '#f59e0b' }}>{filtered.length}</strong> products
                    {category !== 'All' && <> in <strong style={{ color: '#f8fafc' }}>{category}</strong></>}
                </p>

                {/* Grid */}
                {loading ? (
                    <div className="text-center py-5">
                        <Spinner style={{ color: '#f59e0b', width: 48, height: 48 }} />
                        <p style={{ color: '#64748b', marginTop: 16 }}>Loading products…</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-5">
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                        <h5 style={{ color: '#94a3b8' }}>No products found</h5>
                        <p style={{ color: '#64748b' }}>Try adjusting your search or filter</p>
                    </div>
                ) : (
                    <Row className="g-4">
                        {filtered.map((p, i) => (
                            <Col key={p.id || i} sm={6} lg={3}>
                                <ProductCard product={p} index={i} />
                            </Col>
                        ))}
                    </Row>
                )}
            </Container>
        </div>
    );
}
