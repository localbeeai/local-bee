import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams, Link } from 'react-router-dom';
import Messages from '../components/Messages';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Welcome = styled.div`
  background: var(--secondary-green);
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .profile-section {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    flex: 1;
  }

  .user-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--primary-green-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    color: white;
    overflow: hidden;
    border: 3px solid white;
    box-shadow: var(--shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  .welcome-text {
    h1 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      margin: 0 0 0.5rem 0;
    }

    p {
      color: var(--text-light);
      margin: 0;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TabContainer = styled.div`
  margin-bottom: 2rem;
`;

const TabButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  border-bottom: 2px solid var(--border-light);
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  color: ${props => props.active ? 'var(--primary-green)' : 'var(--text-light)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-green)' : 'transparent'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: var(--primary-green);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  text-align: center;

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.25rem;
  }

  .label {
    color: var(--text-light);
    font-size: 0.875rem;
  }
`;

const Section = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  margin-bottom: 2rem;
`;

const SectionHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    color: var(--text-dark);
    margin: 0;
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const OrderList = styled.div`
  display: grid;
  gap: 1rem;
`;

const OrderCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  gap: 1rem;

  .order-image {
    width: 60px;
    height: 60px;
    background: var(--natural-beige);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 0.5rem;
    }
  }

  .order-info {
    flex: 1;

    h4 {
      color: var(--text-dark);
      margin-bottom: 0.25rem;
    }

    p {
      color: var(--text-light);
      font-size: 0.875rem;
      margin: 0;
    }
  }

  .order-status {
    text-align: right;

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 0.25rem;

      &.pending {
        background: #fef3c7;
        color: #92400e;
      }

      &.confirmed {
        background: #dbeafe;
        color: #1e40af;
      }

      &.shipped {
        background: #e0e7ff;
        color: #5b21b6;
      }

      &.delivered {
        background: #d1fae5;
        color: #065f46;
      }
    }

    .price {
      font-weight: 600;
      color: var(--primary-green);
    }
  }
`;

const FavoritesList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const FavoriteCard = styled.div`
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  overflow: hidden;

  .product-image {
    height: 120px;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .product-info {
    padding: 1rem;

    h4 {
      color: var(--text-dark);
      margin-bottom: 0.25rem;
      font-size: 0.875rem;
    }

    .price {
      color: var(--primary-green);
      font-weight: 600;
    }

    .merchant {
      color: var(--text-light);
      font-size: 0.75rem;
    }
  }
`;

const AddressCard = styled.div`
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  padding: 1rem;
  margin-bottom: 1rem;

  .address-header {
    display: flex;
    justify-content: between;
    align-items: center;
    margin-bottom: 0.5rem;

    .address-type {
      font-weight: 600;
      color: var(--text-dark);
    }

    .default-badge {
      background: var(--primary-green);
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 1rem;
      font-size: 0.75rem;
    }
  }

  .address-info {
    color: var(--text-light);
    font-size: 0.875rem;
    line-height: 1.4;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-light);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h3 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
`;

const MerchantsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const MerchantCard = styled(Link)`
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 1rem;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;
  display: block;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  }

  .merchant-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .merchant-avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: var(--primary-green-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-green);
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
    }

    .merchant-info {
      flex: 1;

      .business-name {
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-dark);
        margin-bottom: 0.25rem;
      }

      .location {
        font-size: 0.875rem;
        color: var(--text-light);
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }
  }

  .merchant-stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border-light);

    .stat {
      text-align: center;

      .number {
        font-weight: 600;
        color: var(--primary-green);
        font-size: 1.125rem;
      }

      .label {
        font-size: 0.75rem;
        color: var(--text-light);
        margin-top: 0.25rem;
      }
    }

    .rating {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.875rem;

      .stars {
        color: #fbbf24;
      }

      .score {
        font-weight: 600;
        color: var(--text-dark);
      }

      .count {
        color: var(--text-light);
      }
    }
  }
`;

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [favoritesLoading, setFavoritesLoading] = useState(false);
  const [nearbyMerchants, setNearbyMerchants] = useState([]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // TODO: Implement API calls for customer data
      // For now, using mock data
      setStats({
        totalOrders: 12,
        pendingOrders: 2,
        totalSpent: 247.50,
        favoriteItems: 8
      });

      // Mock orders data
      setOrders([
        {
          _id: '1',
          orderNumber: 'LM001234',
          items: [{
            product: {
              name: 'Organic Tomatoes',
              images: [{ url: null }]
            },
            quantity: 2,
            price: 15.99
          }],
          merchant: {
            businessInfo: {
              businessName: 'Green Valley Farm'
            }
          },
          status: 'delivered',
          total: 15.99,
          createdAt: '2024-01-15',
          shipping: {
            trackingNumber: 'TRK123456'
          }
        },
        {
          _id: '2',
          orderNumber: 'LM001235',
          items: [{
            product: {
              name: 'Fresh Bread',
              images: [{ url: null }]
            },
            quantity: 1,
            price: 8.50
          }],
          merchant: {
            businessInfo: {
              businessName: 'Local Bakery'
            }
          },
          status: 'shipped',
          total: 8.50,
          createdAt: '2024-01-20',
          shipping: {
            trackingNumber: 'TRK789012'
          }
        }
      ]);

      // Mock favorites data
      setFavorites([
        {
          _id: '1',
          name: 'Organic Honey',
          price: 12.99,
          merchant: 'Bee Happy Farm',
          image: null
        },
        {
          _id: '2',
          name: 'Artisan Cheese',
          price: 18.50,
          merchant: 'Mountain Dairy',
          image: null
        }
      ]);

      // Mock nearby merchants data
      setNearbyMerchants([
        {
          _id: '1',
          businessInfo: {
            businessName: 'Green Valley Farm',
            businessPhoto: { url: null }
          },
          address: {
            city: 'Downtown',
            distance: 2.3
          },
          productCount: 15,
          rating: { average: 4.8, count: 24 }
        },
        {
          _id: '2',
          businessInfo: {
            businessName: 'Local Bakery Co',
            businessPhoto: { url: null }
          },
          address: {
            city: 'Midtown',
            distance: 4.1
          },
          productCount: 8,
          rating: { average: 4.6, count: 18 }
        },
        {
          _id: '3',
          businessInfo: {
            businessName: 'Organic Delights',
            businessPhoto: { url: null }
          },
          address: {
            city: 'Riverside',
            distance: 6.7
          },
          productCount: 22,
          rating: { average: 4.9, count: 31 }
        }
      ]);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axios.get('/api/orders/customer');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchFavorites = async () => {
    setFavoritesLoading(true);
    try {
      const response = await axios.get('/api/users/favorites');
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    } finally {
      setFavoritesLoading(false);
    }
  };

  const addToFavorites = async (productId) => {
    try {
      await axios.post('/api/users/favorites', { productId });
      fetchFavorites(); // Refresh the favorites list
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId) => {
    try {
      await axios.delete(`/api/users/favorites/${productId}`);
      fetchFavorites(); // Refresh the favorites list
    } catch (error) {
      console.error('Error removing from favorites:', error);
      alert('Failed to remove from favorites');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    
    // Fetch data based on the active tab
    if (tab === 'orders' && orders.length === 0) {
      fetchOrders();
    } else if (tab === 'favorites' && favorites.length === 0) {
      fetchFavorites();
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push('★');
    }
    if (hasHalfStar) {
      stars.push('☆');
    }
    return stars.join('');
  };

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard>
          <div className="icon">📦</div>
          <div className="number">{stats.totalOrders || 0}</div>
          <div className="label">Total Orders</div>
        </StatCard>
        <StatCard>
          <div className="icon">⏳</div>
          <div className="number">{stats.pendingOrders || 0}</div>
          <div className="label">Pending Orders</div>
        </StatCard>
        <StatCard>
          <div className="icon">💰</div>
          <div className="number">${stats.totalSpent?.toFixed(2) || '0.00'}</div>
          <div className="label">Total Spent</div>
        </StatCard>
        <StatCard>
          <div className="icon">❤️</div>
          <div className="number">{stats.favoriteItems || 0}</div>
          <div className="label">Favorite Items</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Recent Orders</h2>
          <button 
            className="btn-primary"
            onClick={() => handleTabChange('orders')}
          >
            View All
          </button>
        </SectionHeader>
        <SectionContent>
          {orders.length === 0 ? (
            <EmptyState>
              <div className="icon">📦</div>
              <h3>No orders yet</h3>
              <p>Start shopping to see your orders here!</p>
            </EmptyState>
          ) : (
            <OrderList>
              {orders.slice(0, 3).map(order => (
                <OrderCard key={order._id}>
                  <div className="order-image">
                    {order.items?.[0]?.product?.images?.[0]?.url ? (
                      <img src={getImageUrl(order.items[0].product.images[0].url)} alt={order.items[0].product.name} />
                    ) : (
                      '📦'
                    )}
                  </div>
                  <div className="order-info">
                    <h4>Order #{order.orderNumber || order._id.slice(-8)}</h4>
                    <p>{order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''} from {order.merchant?.businessInfo?.businessName || order.merchant?.name}</p>
                    <p>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="order-status">
                    <div className={`status ${order.status}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </div>
                    <div className="price">${order.total?.toFixed(2) || '0.00'}</div>
                  </div>
                </OrderCard>
              ))}
            </OrderList>
          )}
        </SectionContent>
      </Section>
    </>
  );

  const renderOrders = () => (
    <Section>
      <SectionHeader>
        <h2>All Orders</h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
          {orders.length} orders found
        </div>
      </SectionHeader>
      <SectionContent>
        {ordersLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading your orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <EmptyState>
            <div className="icon">📦</div>
            <h3>No orders yet</h3>
            <p>Start shopping to see your orders here!</p>
            <Link to="/products" style={{ 
              display: 'inline-block', 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-green)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}>
              Browse Products
            </Link>
          </EmptyState>
        ) : (
          <OrderList>
            {orders.map(order => (
              <OrderCard key={order._id}>
                <div className="order-image">
                  {order.items?.[0]?.product?.images?.[0]?.url ? (
                    <img src={getImageUrl(order.items[0].product.images[0].url)} alt={order.items[0].product.name} />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="order-info">
                  <h4>Order #{order.orderNumber || order._id.slice(-8)}</h4>
                  <p>{order.items.length} item{order.items.length !== 1 ? 's' : ''} from {order.merchant?.businessInfo?.businessName || order.merchant?.name}</p>
                  <p>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
                  {order.shipping?.trackingNumber && (
                    <p style={{ color: 'var(--primary-green)', fontWeight: '500' }}>
                      Tracking: {order.shipping.trackingNumber}
                    </p>
                  )}
                </div>
                <div className="order-status">
                  <div className={`status ${order.status}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div className="price">${order.total.toFixed(2)}</div>
                </div>
              </OrderCard>
            ))}
          </OrderList>
        )}
      </SectionContent>
    </Section>
  );

  const renderFavorites = () => (
    <Section>
      <SectionHeader>
        <h2>Favorite Items</h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
          {favorites.length} favorite{favorites.length !== 1 ? 's' : ''}
        </div>
      </SectionHeader>
      <SectionContent>
        {favoritesLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading your favorites...</div>
          </div>
        ) : favorites.length === 0 ? (
          <EmptyState>
            <div className="icon">❤️</div>
            <h3>No favorites yet</h3>
            <p>Browse products and add them to your favorites!</p>
            <Link to="/products" style={{ 
              display: 'inline-block', 
              marginTop: '1rem',
              padding: '0.75rem 1.5rem',
              background: 'var(--primary-green)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600'
            }}>
              Browse Products
            </Link>
          </EmptyState>
        ) : (
          <FavoritesList>
            {favorites.map(item => (
              <FavoriteCard key={item._id}>
                <div className="product-image">
                  {item.images?.length > 0 ? (
                    <img src={(item.images.find(img => img.isFeatured) || item.images[0]).url} alt={item.name} />
                  ) : (
                    '📦'
                  )}
                </div>
                <div className="product-info">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <Link 
                      to={`/products/${item._id}`}
                      style={{ textDecoration: 'none', color: 'inherit', flex: '1' }}
                    >
                      <h4>{item.name}</h4>
                    </Link>
                    <button
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.25rem',
                        color: '#ef4444',
                        padding: '0.25rem',
                        marginLeft: '0.5rem'
                      }}
                      onClick={() => removeFromFavorites(item._id)}
                      title="Remove from favorites"
                    >
                      ❤️
                    </button>
                  </div>
                  <div className="price">${item.price?.toFixed(2) || '0.00'}</div>
                  <div className="merchant">
                    {item.merchant?.businessInfo?.businessName || item.merchant?.name || 'Local Merchant'}
                  </div>
                  {item.inventory?.quantity !== undefined && (
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: item.inventory.quantity > 0 ? 'var(--primary-green)' : '#ef4444',
                      marginTop: '0.25rem',
                      fontWeight: '500'
                    }}>
                      {item.inventory.quantity > 0 ? `${item.inventory.quantity} in stock` : 'Out of stock'}
                    </div>
                  )}
                </div>
              </FavoriteCard>
            ))}
          </FavoritesList>
        )}
      </SectionContent>
    </Section>
  );

  const renderAddresses = () => (
    <Section>
      <SectionHeader>
        <h2>Delivery Addresses</h2>
        <button className="btn-primary">Add Address</button>
      </SectionHeader>
      <SectionContent>
        <AddressCard>
          <div className="address-header">
            <span className="address-type">Primary Address</span>
            <span className="default-badge">Default</span>
          </div>
          <div className="address-info">
            {user?.address?.street && `${user.address.street}, `}
            {user?.address?.city && `${user.address.city}, `}
            {user?.address?.state && `${user.address.state} `}
            {user?.address?.zipCode && user.address.zipCode}
          </div>
        </AddressCard>
        
        <EmptyState>
          <div className="icon">📍</div>
          <h3>Add more addresses</h3>
          <p>Add work, family, or other addresses for easier delivery</p>
        </EmptyState>
      </SectionContent>
    </Section>
  );

  if (loading) {
    return (
      <Container>
        <div style={{textAlign: 'center', padding: '3rem'}}>Loading dashboard...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Welcome>
        <div className="profile-section">
          <div className="user-avatar">
            {user?.avatar?.url ? (
              <img src={user.avatar.url} alt="Profile" />
            ) : (
              user?.name?.[0] || '?'
            )}
          </div>
          <div className="welcome-text">
            <h1>👋 Welcome back, {user?.name}!</h1>
            <p>Manage your orders, track deliveries, and discover amazing local products.</p>
          </div>
        </div>
      </Welcome>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => handleTabChange('overview')}
          >
            📊 Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => handleTabChange('orders')}
          >
            📦 Orders
          </TabButton>
          <TabButton 
            active={activeTab === 'favorites'} 
            onClick={() => handleTabChange('favorites')}
          >
            ❤️ Favorites
          </TabButton>
          <TabButton 
            active={activeTab === 'messages'} 
            onClick={() => handleTabChange('messages')}
          >
            💬 Messages
          </TabButton>
          <TabButton 
            active={activeTab === 'addresses'} 
            onClick={() => handleTabChange('addresses')}
          >
            📍 Addresses
          </TabButton>
        </TabButtons>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'favorites' && renderFavorites()}
        {activeTab === 'messages' && <Messages />}
        {activeTab === 'addresses' && renderAddresses()}
      </TabContainer>
    </Container>
  );
};

export default CustomerDashboard;