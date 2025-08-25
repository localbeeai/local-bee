import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';
import EnhancedHero from '../components/home/EnhancedHero';
import LocalBusinessSection from '../components/home/LocalBusinessSection';
import HowItWorksSection from '../components/home/HowItWorksSection';

const Hero = styled.section`
  background: linear-gradient(135deg, var(--secondary-green), var(--accent-green));
  padding: 4rem 0;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h1 {
    font-size: 3rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 1rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.25rem;
    color: var(--text-light);
    margin-bottom: 2rem;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  .btn-primary, .btn-secondary {
    padding: 1rem 2rem;
    font-size: 1.125rem;
    text-decoration: none;
    display: inline-block;
  }
`;

const FeaturesSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const Features = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }
`;

const FeatureGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const FeatureCard = styled.div`
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
  background: var(--natural-beige);

  .icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    line-height: 1.6;
  }
`;

const PopularSection = styled.section`
  padding: 4rem 0;
  background: white;
`;

const PopularProducts = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const ProductCard = styled(Link)`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .product-image {
    height: 200px;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badges {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      .badge {
        background: var(--primary-green);
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 1rem;
        font-size: 0.75rem;
        font-weight: 500;

        &.organic {
          background: #16a34a;
        }

        &.local {
          background: #0ea5e9;
        }
      }
    }
  }

  .product-content {
    padding: 1.5rem;

    .merchant-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      font-size: 0.75rem;
      color: var(--text-light);

      .merchant-avatar {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-green-light);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }

    h3 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 1.125rem;
      line-height: 1.3;
    }

    .description {
      color: var(--text-light);
      font-size: 0.875rem;
      line-height: 1.4;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .product-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .price {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-green);
      }

      .unit {
        font-size: 0.75rem;
        color: var(--text-light);
      }

      .rating {
        display: flex;
        align-items: center;
        gap: 0.25rem;
        font-size: 0.75rem;
        color: var(--text-light);

        .stars {
          color: #fbbf24;
        }
      }
    }
  }
`;

const ViewAllButton = styled(Link)`
  display: block;
  text-align: center;
  margin: 2rem auto 0;
  padding: 1rem 2rem;
  background: var(--primary-green);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  width: fit-content;
  transition: background 0.2s;

  &:hover {
    background: var(--primary-green-dark);
  }
`;

const CategoriesSection = styled.section`
  padding: 4rem 0;
  background: var(--natural-beige);
`;

const Categories = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;

  h2 {
    text-align: center;
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 3rem;
  }
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const CategoryCard = styled(Link)`
  display: block;
  text-decoration: none;
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }

  .category-image {
    height: 150px;
    background: var(--primary-green-light);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
  }

  .category-content {
    padding: 1.5rem;
    
    h3 {
      color: var(--text-dark);
      font-size: 1.25rem;
      margin-bottom: 0.5rem;
    }

    p {
      color: var(--text-light);
      font-size: 0.875rem;
    }
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
      background: var(--natural-beige);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--text-dark);
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

const Home = () => {
  const { user } = useAuth();
  const { 
    hasLocation, 
    getLocationParams, 
    promptLocationSetup, 
    userLocation,
    getLocationString 
  } = useLocation();
  const [popularProducts, setPopularProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [nearbyMerchants, setNearbyMerchants] = useState([]);
  
  useEffect(() => {
    fetchPopularProducts();
    
    // Auto-prompt location setup for new users after 3 seconds
    if (!hasLocation() && !user) {
      const hasPromptedBefore = localStorage.getItem('hasPromptedLocation');
      if (!hasPromptedBefore) {
        setTimeout(() => {
          promptLocationSetup();
          localStorage.setItem('hasPromptedLocation', 'true');
        }, 3000);
      }
    }
  }, [user, hasLocation, promptLocationSetup]);
  
  // Refresh products when location changes
  useEffect(() => {
    fetchPopularProducts();
  }, [userLocation]);

  const fetchPopularProducts = async () => {
    try {
      setLoadingProducts(true);
      const params = new URLSearchParams();
      
      // Add location parameters
      const locationParams = getLocationParams();
      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value);
        }
      });
      
      // Get popular products (highest rated, most views, most recent)
      params.set('sort', '-views,-rating.average,-createdAt');
      params.set('limit', '8');
      params.set('featured', 'true'); // Optional: only show featured products
      
      const response = await axios.get(`/api/products?${params.toString()}`);
      setPopularProducts(response.data.products || []);

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
      console.error('Error fetching popular products:', error);
      setPopularProducts([]);
    } finally {
      setLoadingProducts(false);
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

  const renderPopularProducts = () => {
    if (loadingProducts) {
      return (
        <ProductsGrid>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{
              background: 'var(--natural-beige)',
              borderRadius: '1rem',
              height: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-light)'
            }}>
              Loading...
            </div>
          ))}
        </ProductsGrid>
      );
    }

    if (popularProducts.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
          <p>No popular products found in your area yet. Check back soon!</p>
        </div>
      );
    }

    return (
      <ProductsGrid>
        {popularProducts.map(product => (
          <ProductCard key={product._id} to={`/products/${product._id}`}>
            <div className="product-image">
              {product.images?.[0] ? (
                <img src={getImageUrl(product.images[0].url)} alt={product.name} />
              ) : (
                '📷'
              )}
              <div className="badges">
                {product.isOrganic && <span className="badge organic">Organic</span>}
                {product.isLocallySourced && <span className="badge local">Local</span>}
                {product.featured && <span className="badge">Featured</span>}
              </div>
            </div>
            <div className="product-content">
              <div className="merchant-info">
                <div className="merchant-avatar">
                  {product.merchant?.businessPhoto?.url ? (
                    <img src={getImageUrl(product.merchant.businessPhoto.url)} alt="Business" />
                  ) : (
                    product.merchant?.businessInfo?.businessName?.[0] || 
                    product.merchant?.name?.[0] || '?'
                  )}
                </div>
                <span>
                  {product.merchant?.businessInfo?.businessName || 
                   product.merchant?.name || 'Local Merchant'}
                  {product.merchant?.address?.city && (
                    <span style={{ color: 'var(--primary-green)', marginLeft: '4px' }}>
                      • {product.merchant.address.city}
                    </span>
                  )}
                </span>
              </div>
              <h3>{product.name}</h3>
              <p className="description">{product.description}</p>
              <div className="product-footer">
                <div>
                  <div className="price">${product.price}</div>
                  <div className="unit">per {product.inventory.unit}</div>
                </div>
                {product.rating.count > 0 && (
                  <div className="rating">
                    <span className="stars">
                      {renderStars(product.rating.average)}
                    </span>
                    <span>({product.rating.count})</span>
                  </div>
                )}
              </div>
            </div>
          </ProductCard>
        ))}
      </ProductsGrid>
    );
  };
  
  const categories = [
    { name: 'Fresh Produce', icon: '🥕', path: '/products?category=produce', desc: 'Farm-fresh fruits & vegetables' },
    { name: 'Dairy & Eggs', icon: '🥛', path: '/products?category=dairy', desc: 'Local dairy products' },
    { name: 'Meat & Seafood', icon: '🥩', path: '/products?category=meat', desc: 'Locally sourced proteins' },
    { name: 'Seafood', icon: '🦐', path: '/products?category=seafood', desc: 'Fresh local seafood' },
    { name: 'Bakery', icon: '🥖', path: '/products?category=bakery', desc: 'Fresh baked goods' },
    { name: 'Beverages', icon: '☕', path: '/products?category=beverages', desc: 'Coffee, tea, juices & more' },
    { name: 'Prepared Foods', icon: '🍽️', path: '/products?category=prepared-foods', desc: 'Ready-to-eat meals' },
    { name: 'Snacks', icon: '🍪', path: '/products?category=snacks', desc: 'Local treats & snacks' },
    { name: 'Condiments', icon: '🍯', path: '/products?category=condiments', desc: 'Sauces, jams & spreads' },
    { name: 'Spices & Herbs', icon: '🌿', path: '/products?category=spices', desc: 'Fresh & dried seasonings' },
    { name: 'Health Products', icon: '🧴', path: '/products?category=health', desc: 'Natural wellness products' },
    { name: 'Beauty Products', icon: '💄', path: '/products?category=beauty', desc: 'Natural beauty items' },
    { name: 'Home Goods', icon: '🏠', path: '/products?category=home', desc: 'Candles, decor & essentials' },
    { name: 'Local Crafts', icon: '🎨', path: '/products?category=crafts', desc: 'Handmade local goods' },
    { name: 'Fresh Flowers', icon: '🌸', path: '/products?category=flowers', desc: 'Locally grown flowers' },
    { name: 'Other Items', icon: '📦', path: '/products?category=other', desc: 'Unique local products' },
  ];

  return (
    <>
      <EnhancedHero />

      <LocalBusinessSection />
      
      <HowItWorksSection />

      <PopularSection>
        <PopularProducts>
          <h2>
            {userLocation ? 
              `🔥 Popular in ${userLocation}` : 
              '🔥 Popular Products'
            }
          </h2>
          {renderPopularProducts()}
          {popularProducts.length > 0 && (
            <ViewAllButton to={userLocation ? `/products?zip=${userLocation}` : '/products'}>
              View All Products
            </ViewAllButton>
          )}
        </PopularProducts>
      </PopularSection>

      <PopularSection>
        <PopularProducts>
          <h2>Local Merchants Near You</h2>
          {nearbyMerchants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
              <p>
                {userLocation ? 
                  `No merchants found near ${userLocation} yet. We're working to bring more local merchants to your area!` :
                  'Set your location to discover amazing local merchants in your area!'
                }
              </p>
              {!userLocation && (
                <button 
                  onClick={promptLocationSetup}
                  style={{
                    background: 'var(--primary-green)',
                    color: 'white',
                    border: 'none',
                    padding: '1rem 2rem',
                    borderRadius: '0.5rem',
                    marginTop: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  📍 Set Your Location
                </button>
              )}
            </div>
          ) : (
            <MerchantsList>
              {nearbyMerchants.slice(0, 3).map(merchant => (
                <MerchantCard key={merchant._id} to={`/merchant/${merchant._id}`}>
                  <div className="merchant-header">
                    <div className="merchant-avatar">
                      {merchant.businessInfo?.businessPhoto?.url ? (
                        <img src={getImageUrl(merchant.businessInfo.businessPhoto.url)} alt={merchant.businessInfo.businessName} />
                      ) : (
                        merchant.businessInfo?.businessName?.[0] || 'M'
                      )}
                    </div>
                    <div className="merchant-info">
                      <div className="business-name">
                        {merchant.businessInfo?.businessName || 'Local Business'}
                      </div>
                      <div className="location">
                        {merchant.address?.city || 'Local'} • {merchant.address?.distance?.toFixed(1) || '0'} mi away
                      </div>
                    </div>
                  </div>
                  <div className="merchant-stats">
                    <div className="stat">
                      <div className="number">{merchant.productCount || 0}</div>
                      <div className="label">Products</div>
                    </div>
                    {merchant.rating?.count > 0 && (
                      <div className="rating">
                        <span className="stars">
                          {renderStars(merchant.rating.average)}
                        </span>
                        <span className="score">{merchant.rating.average}</span>
                        <span className="count">({merchant.rating.count})</span>
                      </div>
                    )}
                  </div>
                </MerchantCard>
              ))}
            </MerchantsList>
          )}
        </PopularProducts>
      </PopularSection>

      <CategoriesSection>
        <Categories>
          <h2>Shop by Category</h2>
          <CategoryGrid>
            {categories.map((category) => {
              const categoryPath = userLocation ? 
                `${category.path}&zip=${userLocation}` : 
                category.path;
              
              return (
                <CategoryCard key={category.name} to={categoryPath}>
                  <div className="category-image">
                    {category.icon}
                  </div>
                  <div className="category-content">
                    <h3>{category.name}</h3>
                    <p>{category.desc}</p>
                  </div>
                </CategoryCard>
              );
            })}
          </CategoryGrid>
        </Categories>
      </CategoriesSection>

      {/* LocationModal handled by LocationSetupHandler in App.js */}
    </>
  );
};

export default Home;