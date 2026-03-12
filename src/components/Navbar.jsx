import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Navbar as BSNavbar, Nav, Container } from 'react-bootstrap';
import { FiShoppingCart, FiUser, FiLogOut, FiGrid } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { cartCount } = useCart();
    const { user, logout, isLoggedIn, isSeller } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <BSNavbar
            expand="lg"
            fixed="top"
            style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                padding: '12px 0',
                zIndex: 1050,
            }}
        >
            <Container>
                {/* Brand */}
                <BSNavbar.Brand as={Link} to="/" style={{ textDecoration: 'none' }}>
                    <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.6rem', color: '#f59e0b' }}>
                        GunaCart
                    </span>
                </BSNavbar.Brand>

                <BSNavbar.Toggle
                    aria-controls="main-nav"
                    style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                />

                <BSNavbar.Collapse id="main-nav">
                    <Nav className="mx-auto gap-1">
                        {['/', '/products'].map((path, i) => (
                            <NavLink
                                key={path}
                                to={path}
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    padding: '8px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: isActive ? '#f59e0b' : '#94a3b8',
                                    background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                })}
                            >
                                {['Home', 'Products'][i]}
                            </NavLink>
                        ))}
                        {isLoggedIn && !isSeller && (
                            <NavLink
                                to="/orders"
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    padding: '8px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: isActive ? '#f59e0b' : '#94a3b8',
                                    background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                })}
                            >
                                My Orders
                            </NavLink>
                        )}
                        {isLoggedIn && isSeller && (
                            <NavLink
                                to="/seller"
                                style={({ isActive }) => ({
                                    textDecoration: 'none',
                                    padding: '8px 18px',
                                    borderRadius: '8px',
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    color: isActive ? '#f59e0b' : '#94a3b8',
                                    background: isActive ? 'rgba(245,158,11,0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 6,
                                })}
                            >
                                <FiGrid size={15} /> Seller Dashboard
                            </NavLink>
                        )}
                    </Nav>

                    <Nav className="align-items-center gap-2">
                        {/* Cart */}
                        <Link to="/cart" style={{ textDecoration: 'none', position: 'relative' }}>
                            <div style={{
                                background: 'rgba(245,158,11,0.1)',
                                border: '1px solid rgba(245,158,11,0.3)',
                                borderRadius: '10px',
                                padding: '8px 14px',
                                color: '#f59e0b',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                transition: 'all 0.2s',
                                cursor: 'pointer',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,158,11,0.2)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,158,11,0.1)'}
                            >
                                <FiShoppingCart />
                                Cart
                                {cartCount > 0 && (
                                    <span className="cart-badge">{cartCount}</span>
                                )}
                            </div>
                        </Link>

                        {/* Auth */}
                        {isLoggedIn ? (
                            <div className="d-flex align-items-center gap-2">
                                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                                    <FiUser style={{ marginRight: 4 }} />
                                    {user?.name || user?.email?.split('@')[0]}
                                    {isSeller && <span style={{ background: '#f59e0b', color: '#0f172a', borderRadius: 6, fontSize: '0.65rem', fontWeight: 800, padding: '1px 6px', marginLeft: 6 }}>SELLER</span>}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        background: 'rgba(239,68,68,0.15)',
                                        border: '1px solid rgba(239,68,68,0.3)',
                                        borderRadius: '10px',
                                        padding: '8px 14px',
                                        color: '#f87171',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px',
                                        fontWeight: 600,
                                        fontSize: '0.9rem',
                                    }}
                                >
                                    <FiLogOut />
                                    Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login">
                                <button style={{
                                    background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
                                    border: 'none',
                                    borderRadius: '10px',
                                    padding: '8px 20px',
                                    color: '#0f172a',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                }}>
                                    <FiUser />
                                    Login
                                </button>
                            </Link>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}
