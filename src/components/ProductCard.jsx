import { Link } from 'react-router-dom';
import { FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

const PLACEHOLDER_IMGS = [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=280&fit=crop',
    'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&h=280&fit=crop',
    'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=400&h=280&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=280&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=280&fit=crop',
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&h=280&fit=crop',
];

export default function ProductCard({ product, index = 0 }) {
    const { addToCart } = useCart();
    const imgSrc = product.imageUrl || PLACEHOLDER_IMGS[index % PLACEHOLDER_IMGS.length];
    const rating = product.rating || (3.5 + (index % 3) * 0.5);
    const stars = '★'.repeat(Math.round(rating)) + '☆'.repeat(5 - Math.round(rating));

    return (
        <div
            className="glass-card h-100 fade-in-up"
            style={{ cursor: 'pointer', overflow: 'hidden', animationDelay: `${index * 0.05}s` }}
        >
            {/* Image */}
            <div className="product-img-wrap" style={{ position: 'relative' }}>
                <img src={imgSrc} alt={product.name} />
                {/* Category badge */}
                {product.category && (
                    <span style={{
                        position: 'absolute', top: 12, left: 12,
                        background: 'rgba(15,23,42,0.85)', color: '#f59e0b',
                        border: '1px solid rgba(245,158,11,0.4)',
                        padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 700,
                        backdropFilter: 'blur(8px)',
                    }}>
                        {product.category}
                    </span>
                )}
                {/* Quick-view overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(15,23,42,0.6)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    opacity: 0, transition: 'opacity 0.3s',
                }}
                    onMouseEnter={e => e.currentTarget.style.opacity = 1}
                    onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                    <Link to={`/products/${product.id}`}
                        style={{
                            background: 'rgba(245,158,11,0.9)', color: '#0f172a',
                            border: 'none', borderRadius: 10, padding: '8px 18px',
                            fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}
                    >
                        <FiEye /> View Details
                    </Link>
                </div>
            </div>

            {/* Body */}
            <div style={{ padding: '18px 20px 20px' }}>
                <div className="stars" style={{ fontSize: '0.85rem', marginBottom: 6 }}>
                    {stars}
                    <span style={{ color: '#64748b', marginLeft: 6, fontSize: '0.78rem' }}>({product.reviewCount || Math.floor(20 + (index * 37) % 200)} )</span>
                </div>
                <h6 style={{ color: '#f8fafc', fontWeight: 700, marginBottom: 6, fontSize: '1rem', fontFamily: 'Inter,sans-serif', lineHeight: 1.4 }}>
                    {product.name}
                </h6>
                <p style={{ color: '#64748b', fontSize: '0.82rem', marginBottom: 14, lineHeight: 1.5 }}>
                    {product.description?.substring(0, 70) || 'Premium quality product'}…
                </p>

                <div className="d-flex align-items-center justify-content-between">
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
                        Rs.{product.price?.toFixed(2)}
                    </span>
                    <button
                        id={`add-to-cart-${product.id}`}
                        onClick={() => addToCart(product)}
                        style={{
                            background: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
                            border: 'none', borderRadius: 10, padding: '8px 16px',
                            color: '#0f172a', fontWeight: 700, fontSize: '0.82rem',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5,
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <FiShoppingCart /> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
}
