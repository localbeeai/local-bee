import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const MerchantHeader = styled.div`
  background: linear-gradient(135deg, var(--secondary-green), var(--accent-green));
  border-radius: 1.5rem;
  padding: 3rem;
  margin-bottom: 3rem;
  text-align: center;

  .merchant-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-dark);
    margin: 0 auto 2rem;
    border: 4px solid white;
    box-shadow: var(--shadow);
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
  }

  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .business-type {
    color: var(--text-light);
    font-size: 1.125rem;
    margin-bottom: 1rem;
  }

  .location {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
    margin-bottom: 2rem;
  }

  .description {
    max-width: 600px;
    margin: 0 auto;
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const StatCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: var(--shadow);

  .icon {
    font-size: 2.5rem;
    margin-bottom: 1rem;
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
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const Section = styled.section`
  margin-bottom: 3rem;

  h2 {
    font-size: 2rem;
    color: var(--text-dark);
    margin-bottom: 1.5rem;
  }
`;

const DeliveryInfo = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;

  h3 {
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  .delivery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;

    .delivery-option {
      background: var(--natural-beige);
      padding: 1.5rem;
      border-radius: 0.75rem;

      .option-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        margin-bottom: 1rem;

        .icon {
          font-size: 1.5rem;
        }

        h4 {
          color: var(--text-dark);
          margin: 0;
        }
      }

      .option-details {
        color: var(--text-light);
        font-size: 0.875rem;
        line-height: 1.5;
      }
    }
  }
`;

const ProductsSection = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);

  .products-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;

    h3 {
      color: var(--text-dark);
      margin: 0;
    }

    .filter-buttons {
      display: flex;
      gap: 0.5rem;

      button {
        padding: 0.5rem 1rem;
        border: 1px solid var(--border-light);
        background: ${props => props.active ? 'var(--primary-green)' : 'white'};
        color: ${props => props.active ? 'white' : 'var(--text-dark)'};
        border-radius: 0.5rem;
        font-size: 0.875rem;
        cursor: pointer;

        &:hover {
          background: var(--primary-green-light);
          color: white;
        }
      }
    }
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ProductCard = styled(Link)`
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow);
  }

  .product-image {
    height: 150px;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .price-badge {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      background: var(--primary-green);
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
    }
  }

  .product-content {
    padding: 1rem;

    h4 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 1rem;
      line-height: 1.3;
    }

    .category {
      color: var(--text-light);
      font-size: 0.75rem;
      margin-bottom: 0.5rem;
    }

    .stock-info {
      color: ${props => props.$inStock ? 'var(--primary-green)' : '#ef4444'};
      font-size: 0.75rem;
      font-weight: 500;
    }
  }
`;

const LoadingState = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  font-size: 1.125rem;
  color: var(--text-light);
`;

const ErrorState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-light);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h2 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }
`;

const MerchantProfile = () => {
  const { id } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productFilter, setProductFilter] = useState('all');

  useEffect(() => {
    fetchMerchantData();
  }, [id]);

  const fetchMerchantData = async () => {
    try {
      setLoading(true);
      
      // Fetch merchant info
      const merchantResponse = await axios.get(`/api/users/${id}`);
      setMerchant(merchantResponse.data);

      // Fetch merchant's products
      const productsResponse = await axios.get(`/api/products?merchant=${id}`);
      setProducts(productsResponse.data.products || []);
      
      setError(null);
    } catch (error) {
      console.error('Error fetching merchant data:', error);
      setError(error.response?.status === 404 ? 'Merchant not found' : 'Error loading merchant');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = () => {
    switch (productFilter) {
      case 'inStock':
        return products.filter(product => product.inventory.quantity > 0);
      case 'featured':
        return products.filter(product => product.featured);
      default:
        return products;
    }
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading merchant profile...</LoadingState>
      </Container>
    );
  }

  if (error || !merchant) {
    return (
      <Container>
        <ErrorState>
          <div className="icon">😕</div>
          <h2>{error || 'Merchant not found'}</h2>
          <p>This merchant profile might not exist or has been removed.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Browse Products
          </Link>
        </ErrorState>
      </Container>
    );
  }

  const stats = [
    { icon: '📦', number: products.length, label: 'Products' },
    { icon: '⭐', number: '4.8', label: 'Rating' },
    { icon: '🛒', number: '2.1K', label: 'Sales' },
    { icon: '📞', number: '98%', label: 'Response Rate' }
  ];

  return (
    <Container>
      <MerchantHeader>
        <div className="merchant-avatar">
          {merchant.businessInfo?.businessPhoto?.url ? (
            <img src={getImageUrl(merchant.businessInfo.businessPhoto.url)} alt="Business" />
          ) : (
            merchant.businessInfo?.businessName?.[0] || merchant.name?.[0] || '?'
          )}
        </div>
        
        <h1>{merchant.businessInfo?.businessName || merchant.name}</h1>
        
        <div className="business-type">
          {merchant.businessInfo?.businessType || 'Local Business'}
        </div>

        <div className="location">
          📍 {merchant.address?.city || 'Local Area'}
          {merchant.address?.state && `, ${merchant.address.state}`}
          {merchant.address?.zipCode && ` ${merchant.address.zipCode}`}
        </div>

        {merchant.businessInfo?.businessDescription && (
          <div className="description">
            {merchant.businessInfo.businessDescription}
          </div>
        )}
      </MerchantHeader>

      <StatsGrid>
        {stats.map((stat, index) => (
          <StatCard key={index}>
            <div className="icon">{stat.icon}</div>
            <div className="number">{stat.number}</div>
            <div className="label">{stat.label}</div>
          </StatCard>
        ))}
      </StatsGrid>

      <Section>
        <h2>🚚 Delivery & Pickup</h2>
        <DeliveryInfo>
          <div className="delivery-grid">
            {merchant.businessInfo?.offersPickup && (
              <div className="delivery-option">
                <div className="option-header">
                  <div className="icon">🏪</div>
                  <h4>Pickup Available</h4>
                </div>
                <div className="option-details">
                  Pick up your order directly from our location during business hours.
                  Perfect for fresh items and avoiding delivery fees.
                </div>
              </div>
            )}

            {merchant.businessInfo?.offersDelivery && (
              <div className="delivery-option">
                <div className="option-header">
                  <div className="icon">🚚</div>
                  <h4>Local Delivery</h4>
                </div>
                <div className="option-details">
                  {merchant.businessInfo?.deliveryRadius && (
                    <>We deliver within {merchant.businessInfo.deliveryRadius} miles of our location. </>
                  )}
                  Standard delivery takes 1-2 business days.
                </div>
              </div>
            )}

            {merchant.businessInfo?.sameDayDelivery && (
              <div className="delivery-option">
                <div className="option-header">
                  <div className="icon">⚡</div>
                  <h4>Same-Day Delivery</h4>
                </div>
                <div className="option-details">
                  Order by 12 PM for same-day delivery! Perfect when you need 
                  fresh ingredients or products urgently.
                </div>
              </div>
            )}
          </div>
        </DeliveryInfo>
      </Section>

      <Section>
        <ProductsSection>
          <div className="products-header">
            <h3>Our Products ({filteredProducts().length})</h3>
            <div className="filter-buttons">
              <button 
                className={productFilter === 'all' ? 'active' : ''}
                onClick={() => setProductFilter('all')}
              >
                All Products
              </button>
              <button 
                className={productFilter === 'inStock' ? 'active' : ''}
                onClick={() => setProductFilter('inStock')}
              >
                In Stock
              </button>
              <button 
                className={productFilter === 'featured' ? 'active' : ''}
                onClick={() => setProductFilter('featured')}
              >
                Featured
              </button>
            </div>
          </div>

          {filteredProducts().length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
              <h3 style={{ color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
                {productFilter === 'all' ? 'No products yet' : 'No products match this filter'}
              </h3>
              <p>
                {productFilter === 'all' 
                  ? 'This merchant hasn\'t listed any products yet. Check back soon!'
                  : 'Try a different filter to see more products.'
                }
              </p>
            </div>
          ) : (
            <ProductGrid>
              {filteredProducts().map(product => (
                <ProductCard 
                  key={product._id} 
                  to={`/products/${product._id}`}
                  $inStock={product.inventory.quantity > 0}
                >
                  <div className="product-image">
                    {product.images?.[0] ? (
                      <img 
                        src={getImageUrl(product.images[0].url)} 
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-product.png';
                        }}
                      />
                    ) : (
                      '📷'
                    )}
                    <div className="price-badge">${product.price}</div>
                  </div>
                  <div className="product-content">
                    <h4>{product.name}</h4>
                    <div className="category">
                      {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')}
                    </div>
                    <div className="stock-info">
                      {product.inventory.quantity > 0 
                        ? `${product.inventory.quantity} in stock`
                        : 'Out of stock'
                      }
                    </div>
                  </div>
                </ProductCard>
              ))}
            </ProductGrid>
          )}
        </ProductsSection>
      </Section>
    </Container>
  );
};

export default MerchantProfile;