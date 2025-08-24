import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';
import NotificationBell from './NotificationBell';
import { getImageUrl } from '../utils/imageUrl';
import { 
  MagnifyingGlassIcon, 
  ShoppingCartIcon, 
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  BuildingStorefrontIcon,
  Cog6ToothIcon,
  UserCircleIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const HeaderContainer = styled.header`
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 100;
`;

const TopBar = styled.div`
  background: var(--primary-green);
  color: white;
  padding: 0.5rem 0;
  font-size: 0.875rem;
  text-align: center;
`;

const MainHeader = styled.div`
  padding: 1rem 0;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Logo = styled(Link)`
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-green);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 600px;
  margin: 0 2rem;
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  padding-left: 3rem;
  border: 2px solid var(--border-light);
  border-radius: 2rem;
  font-size: 1rem;

  &:focus {
    border-color: var(--primary-green);
    outline: none;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
  }
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.25rem;
  height: 1.25rem;
  color: var(--text-light);
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--text-dark);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;

  &:hover {
    color: var(--primary-green);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  position: relative;

  &:hover {
    background-color: var(--secondary-green);
  }

  .cart-badge {
    position: absolute;
    top: 0;
    right: 0;
    background: #ef4444;
    color: white;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    min-width: 20px;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }
`;

const UserDropdown = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
  color: var(--text-dark);
  font-weight: 500;

  &:hover {
    background-color: var(--secondary-green);
  }

  .chevron {
    width: 1rem;
    height: 1rem;
    transition: transform 0.2s;
    transform: ${props => props.$isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  display: ${props => props.$isOpen ? 'block' : 'none'};

  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    color: var(--text-dark);
    text-decoration: none;
    transition: background-color 0.2s;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
    cursor: pointer;

    &:hover {
      background-color: var(--natural-beige);
    }

    &:first-child {
      border-radius: 0.5rem 0.5rem 0 0;
    }

    &:last-child {
      border-radius: 0 0 0.5rem 0.5rem;
    }

    .icon {
      width: 1.25rem;
      height: 1.25rem;
      color: var(--text-light);
    }
  }

  .dropdown-divider {
    height: 1px;
    background: var(--border-light);
    margin: 0.25rem 0;
  }
`;

const MobileMenu = styled.div`
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  padding: 1rem;

  &.open {
    display: block;
  }

  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
  }
`;

const Header = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount, cartItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0); // TODO: Implement notification system
  const dropdownRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  };

  const handleDropdownClick = (path) => {
    navigate(path);
    setDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get display name for user
  const getDisplayName = () => {
    if (user?.role === 'merchant' && user?.businessInfo?.businessName) {
      return user.businessInfo.businessName;
    }
    return user?.name || 'User';
  };

  // Get avatar for user
  const getAvatar = () => {
    if (user?.role === 'merchant' && user?.businessInfo?.businessPhoto?.url) {
      return (
        <img 
          src={getImageUrl(user.businessInfo.businessPhoto.url)} 
          alt="Business"
          style={{ 
            width: '1.25rem', 
            height: '1.25rem', 
            borderRadius: '50%', 
            objectFit: 'cover' 
          }} 
        />
      );
    }
    return user?.role === 'merchant' ? (
      <BuildingStorefrontIcon style={{ width: '1.25rem', height: '1.25rem' }} />
    ) : (
      <UserIcon style={{ width: '1.25rem', height: '1.25rem' }} />
    );
  };

  return (
    <HeaderContainer>
      <TopBar>
        🌱 Shop Local, Support Your Community - Free Delivery on Orders Over $50!
      </TopBar>
      
      <MainHeader>
        <Nav>
          <Logo to="/">
            🌱 LocalMarket
          </Logo>

          <SearchBar>
            <form onSubmit={handleSearch}>
              <SearchIcon />
              <SearchInput
                type="text"
                placeholder="Search for fresh produce, local products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </SearchBar>

          <NavLinks>
            <NavLink to="/products">Browse</NavLink>
            
            {user ? (
              <>
                <NavLink to="/cart">
                  <IconButton>
                    <ShoppingCartIcon style={{ width: '1.5rem', height: '1.5rem' }} />
                    Cart
                    {getCartItemCount() > 0 && (
                      <span className="cart-badge">
                        {getCartItemCount() > 99 ? '99+' : getCartItemCount()}
                      </span>
                    )}
                  </IconButton>
                </NavLink>

                <NotificationBell />
                
                <UserDropdown ref={dropdownRef}>
                  <DropdownButton 
                    $isOpen={dropdownOpen}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {getAvatar()}
                    {getDisplayName()}
                    <ChevronDownIcon className="chevron" />
                  </DropdownButton>
                  
                  <DropdownMenu $isOpen={dropdownOpen}>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        const dashboardPath = 
                          user.role === 'admin' ? '/dashboard/admin' :
                          user.role === 'merchant' ? '/dashboard/merchant' : 
                          '/dashboard/customer';
                        navigate(dashboardPath);
                        setDropdownOpen(false);
                      }}
                    >
                      <BuildingStorefrontIcon className="icon" />
                      {user.role === 'admin' ? 'Admin Panel' : 'Dashboard'}
                    </button>
                    
                    {user.role === 'merchant' && (
                      <Link 
                        to={`/merchant/${user._id}`}
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <UserCircleIcon className="icon" />
                        My Store
                      </Link>
                    )}
                    
                    <button 
                      className="dropdown-item"
                      onClick={() => handleDropdownClick('/messages')}
                    >
                      <ChatBubbleLeftRightIcon className="icon" />
                      Messages
                    </button>
                    
                    <button 
                      className="dropdown-item"
                      onClick={() => handleDropdownClick('/settings')}
                    >
                      <Cog6ToothIcon className="icon" />
                      Settings
                    </button>
                    
                    <div className="dropdown-divider"></div>
                    
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{ color: '#dc2626' }}
                    >
                      <UserIcon className="icon" />
                      Logout
                    </button>
                  </DropdownMenu>
                </UserDropdown>
              </>
            ) : (
              <>
                <NavLink to="/login">
                  <button className="btn-secondary">Login</button>
                </NavLink>
                <NavLink to="/signup">
                  <button className="btn-primary">Sign Up</button>
                </NavLink>
              </>
            )}
          </NavLinks>

          <MobileMenuButton onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? (
              <XMarkIcon style={{ width: '1.5rem', height: '1.5rem' }} />
            ) : (
              <Bars3Icon style={{ width: '1.5rem', height: '1.5rem' }} />
            )}
          </MobileMenuButton>
        </Nav>

        <MobileMenu $isOpen={mobileMenuOpen}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <NavLink to="/products" onClick={() => setMobileMenuOpen(false)}>
              📦 Browse Products
            </NavLink>
            
            {user ? (
              <>
                <NavLink to="/cart" onClick={() => setMobileMenuOpen(false)}>
                  🛒 Shopping Cart ({cartItems?.length || 0})
                </NavLink>
                <NavLink 
                  to={
                    user.role === 'admin' ? '/dashboard/admin' :
                    user.role === 'merchant' ? '/dashboard/merchant' : 
                    '/dashboard/customer'
                  }
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {user.role === 'admin' ? '🛡️ Admin Panel' : '📊 Dashboard'}
                </NavLink>
                <NavLink to="/messages" onClick={() => setMobileMenuOpen(false)}>
                  💬 Messages
                </NavLink>
                <NavLink to="/settings" onClick={() => setMobileMenuOpen(false)}>
                  ⚙️ Settings
                </NavLink>
                {user.role === 'merchant' && (
                  <NavLink to={`/merchant/${user._id || user.id}`} onClick={() => setMobileMenuOpen(false)}>
                    🏪 My Store
                  </NavLink>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0' }}>
                  <span>🔔</span>
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <span style={{
                      background: '#ef4444',
                      color: 'white',
                      borderRadius: '50%',
                      minWidth: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      {unreadCount}
                    </span>
                  )}
                </div>
                <button onClick={handleLogout} className="btn-secondary" style={{ marginTop: '1rem' }}>
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-secondary">Login</button>
                </NavLink>
                <NavLink to="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="btn-primary">Sign Up</button>
                </NavLink>
              </>
            )}
          </div>
        </MobileMenu>
      </MainHeader>
    </HeaderContainer>
  );
};

export default Header;