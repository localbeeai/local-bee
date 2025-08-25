import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;

  h1 {
    color: var(--text-dark);
    margin: 0;
  }

  .results-info {
    color: var(--text-light);
    font-size: 0.875rem;
  }
`;

const FiltersBar = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  align-items: end;

  .filter-group {
    label {
      display: block;
      margin-bottom: 0.5rem;
      color: var(--text-dark);
      font-weight: 500;
      font-size: 0.875rem;
    }

    select, input {
      width: 100%;
      padding: 0.5rem;
      font-size: 0.875rem;
    }
  }

  .filter-buttons {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      white-space: nowrap;

      &.apply {
        background: var(--primary-green);
        color: white;
        border: none;
      }

      &.clear {
        background: var(--natural-beige);
        color: var(--text-dark);
        border: 1px solid var(--border-light);
      }
    }
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
    height: 250px;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3rem;
    position: relative;
    
    @media (min-width: 768px) {
      height: 280px;
    }

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

    .favorite-btn {
      position: absolute;
      top: 0.5rem;
      left: 0.5rem;
      background: rgba(255, 255, 255, 0.9);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 1.25rem;
      transition: all 0.2s;
      backdrop-filter: blur(8px);

      &:hover {
        background: rgba(255, 255, 255, 1);
        transform: scale(1.1);
      }

      &.favorited {
        color: #ef4444;
      }

      &.not-favorited {
        color: #d1d5db;
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
        background: var(--natural-beige);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.625rem;
        color: var(--text-dark);
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

    .stock-info {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: ${props => props.inStock ? 'var(--primary-green)' : '#ef4444'};
      font-weight: 500;
    }
  }
`;

const LoadingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
`;

const LoadingCard = styled.div`
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  animation: pulse 2s infinite;

  .skeleton-image {
    height: 200px;
    background: var(--natural-beige);
  }

  .skeleton-content {
    padding: 1.5rem;

    .skeleton-line {
      height: 1rem;
      background: var(--natural-beige);
      border-radius: 0.25rem;
      margin-bottom: 0.5rem;

      &.short {
        width: 60%;
      }

      &.medium {
        width: 80%;
      }
    }
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
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

const FallbackMessage = styled.div`
  background: linear-gradient(135deg, #fef3c7, #fed7aa);
  border: 1px solid #f59e0b;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;

  .icon {
    font-size: 2rem;
    color: #f59e0b;
  }

  .content {
    flex: 1;

    h3 {
      color: #92400e;
      margin: 0 0 0.5rem 0;
      font-size: 1.125rem;
      font-weight: 600;
    }

    p {
      color: #92400e;
      margin: 0;
      font-size: 0.875rem;
      line-height: 1.4;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    
    .icon {
      margin-bottom: 0.5rem;
    }
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;

  button {
    padding: 0.5rem 1rem;
    border: 1px solid var(--border-light);
    background: white;
    color: var(--text-dark);
    border-radius: 0.25rem;
    cursor: pointer;

    &:hover:not(:disabled) {
      background: var(--secondary-green);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.active {
      background: var(--primary-green);
      color: white;
      border-color: var(--primary-green);
    }
  }

  .page-info {
    color: var(--text-light);
    font-size: 0.875rem;
  }
`;

const Products = () => {
  const { user } = useAuth();
  const { getLocationParams, hasLocation, getLocationString, promptLocationSetup, setLocation } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [locationInfo, setLocationInfo] = useState(null);
  const [userFavorites, setUserFavorites] = useState([]);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isOrganic: searchParams.get('isOrganic') || '',
    sort: searchParams.get('sort') || (hasLocation() ? 'distance' : '-createdAt'),
    distance: searchParams.get('distance') || ''
  });

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'produce', label: 'Fresh Produce' },
    { value: 'dairy', label: 'Dairy & Eggs' },
    { value: 'meat', label: 'Meat & Seafood' },
    { value: 'bakery', label: 'Bakery' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'prepared-foods', label: 'Prepared Foods' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'spices', label: 'Spices & Herbs' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'home', label: 'Home Goods' },
    { value: 'crafts', label: 'Local Crafts' },
    { value: 'flowers', label: 'Fresh Flowers' }
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: '-rating.average', label: 'Highest Rated' },
    { value: 'name', label: 'Name A-Z' },
    ...(hasLocation() ? [{ value: 'distance', label: 'Distance: Nearest First' }] : [])
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  useEffect(() => {
    fetchUserFavorites();
  }, [user]);

  // Handle zip code from URL parameters
  useEffect(() => {
    const zipParam = searchParams.get('zip');
    if (zipParam && !hasLocation()) {
      // Set location from URL parameter if not already set
      setLocation(zipParam).catch(error => {
        console.error('Failed to set location from URL zip:', error);
      });
    }
  }, [searchParams, hasLocation, setLocation]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      
      // Add location parameters for proximity-based results
      const locationParams = getLocationParams();
      Object.entries(locationParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.set(key, value);
        }
      });
      
      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data.products || []);
      setPagination(response.data.pagination || {});
      setLocationInfo(response.data.locationInfo || null);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setPagination({});
      setLocationInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '') {
        // Validate price fields are numbers
        if ((key === 'minPrice' || key === 'maxPrice') && value) {
          const numValue = parseFloat(value);
          if (!isNaN(numValue) && numValue >= 0) {
            newParams.set(key, numValue.toString());
          }
        } else if (key === 'distance' && hasLocation()) {
          // Set radius parameter for location-based filtering
          newParams.set('radius', value);
        } else if (key !== 'distance') {
          newParams.set(key, value);
        }
      }
    });
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      isOrganic: '',
      sort: '-createdAt',
      distance: ''
    });
    setSearchParams({});
  };

  const fetchUserFavorites = async () => {
    if (!user) return;
    try {
      // Use localStorage for now since API endpoints may not exist
      const userId = user._id || user.id;
      const storedFavorites = localStorage.getItem(`favorites_${userId}`);
      if (storedFavorites) {
        setUserFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const toggleFavorite = async (productId) => {
    if (!user) {
      alert('Please log in to add favorites');
      return;
    }

    try {
      const isFavorited = userFavorites.includes(productId);
      let newFavorites;
      
      if (isFavorited) {
        newFavorites = userFavorites.filter(id => id !== productId);
      } else {
        newFavorites = [...userFavorites, productId];
      }
      
      setUserFavorites(newFavorites);
      // Store in localStorage for persistence
      const userId = user._id || user.id;
      localStorage.setItem(`favorites_${userId}`, JSON.stringify(newFavorites));
      
    } catch (error) {
      console.error('Error toggling favorite:', error);
      alert('Failed to update favorites');
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

  const renderLoadingCards = () => {
    return Array.from({ length: 8 }, (_, i) => (
      <LoadingCard key={i}>
        <div className="skeleton-image" />
        <div className="skeleton-content">
          <div className="skeleton-line short" />
          <div className="skeleton-line medium" />
          <div className="skeleton-line" />
        </div>
      </LoadingCard>
    ));
  };

  return (
    <Container>
      <Header>
        <h1>🛍️ Browse Local Products</h1>
        <div className="results-info">
          {pagination.totalProducts !== undefined && (
            <span>{pagination.totalProducts} products found</span>
          )}
          {locationInfo && hasLocation() && (
            <div style={{ marginLeft: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <span style={{ color: 'var(--primary-green)', fontWeight: '500' }}>
                📍 Near {getLocationString()}
                {locationInfo.nearbyMerchants !== undefined && locationInfo.nearbyMerchants > 0 && (
                  <span style={{ marginLeft: '0.5rem', color: 'var(--text-light)' }}>
                    • {locationInfo.nearbyMerchants} merchants in area
                  </span>
                )}
              </span>
              {locationInfo.message && (
                <span style={{ 
                  fontSize: '0.875rem', 
                  color: locationInfo.fallbackResults ? 'var(--warning-orange)' : 'var(--text-light)',
                  fontStyle: locationInfo.fallbackResults ? 'italic' : 'normal'
                }}>
                  {locationInfo.fallbackResults ? '⚠️ ' : 'ℹ️ '}{locationInfo.message}
                </span>
              )}
            </div>
          )}
          {!hasLocation() && (
            <button 
              onClick={promptLocationSetup}
              style={{ 
                marginLeft: '1rem', 
                background: 'var(--primary-green)', 
                color: 'white', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.5rem', 
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
            >
              📍 Set Location for Local Products
            </button>
          )}
        </div>
      </Header>

      <FiltersBar>
        <div className="filter-group">
          <label>Search</label>
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label>Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Min Price</label>
          <input
            type="number"
            placeholder="$0"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="filter-group">
          <label>Max Price</label>
          <input
            type="number"
            placeholder="Any"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            min="0"
            step="0.01"
          />
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select
            value={filters.isOrganic}
            onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
          >
            <option value="">All Products</option>
            <option value="true">Organic Only</option>
            <option value="false">Conventional</option>
          </select>
        </div>

        {hasLocation() && (
          <div className="filter-group">
            <label>Distance</label>
            <select
              value={filters.distance}
              onChange={(e) => handleFilterChange('distance', e.target.value)}
            >
              <option value="">Any Distance</option>
              <option value="5">Within 5 miles</option>
              <option value="10">Within 10 miles</option>
              <option value="25">Within 25 miles</option>
              <option value="50">Within 50 miles</option>
              <option value="100">Within 100 miles</option>
            </select>
          </div>
        )}

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-buttons">
          <button className="apply" onClick={applyFilters}>
            Apply
          </button>
          <button className="clear" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </FiltersBar>

      {loading ? (
        <LoadingGrid>
          {renderLoadingCards()}
        </LoadingGrid>
      ) : products.length === 0 ? (
        <EmptyState>
          {locationInfo?.message ? (
            <>
              <div className="icon">📍</div>
              <h3>No local merchants found</h3>
              <p>{locationInfo.message}</p>
              <button 
                onClick={promptLocationSetup}
                style={{ 
                  marginTop: '1rem', 
                  background: 'var(--primary-green)', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '0.5rem', 
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500'
                }}
              >
                Try Different Location
              </button>
            </>
          ) : (
            <>
              <div className="icon">🔍</div>
              <h3>No products found</h3>
              <p>Try adjusting your search criteria or check back later for new products!</p>
            </>
          )}
        </EmptyState>
      ) : (
        <>
          {locationInfo?.fallbackResults && (
            <FallbackMessage>
              <div className="icon">📍</div>
              <div className="content">
                <h3>Showing nearest available merchants</h3>
                <p>{locationInfo.message}</p>
              </div>
            </FallbackMessage>
          )}
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product._id} to={`/products/${product._id}`}>
                <div className="product-image">
                  {product.images?.length > 0 ? (
                    <img 
                      src={getImageUrl((product.images.find(img => img.isFeatured) || product.images[0]).url)} 
                      alt={product.name} 
                    />
                  ) : (
                    '📷'
                  )}
                  {user && (
                    <button
                      className={`favorite-btn ${userFavorites.includes(product._id) ? 'favorited' : 'not-favorited'}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product._id);
                      }}
                      title={userFavorites.includes(product._id) ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      ❤️
                    </button>
                  )}
                  <div className="badges">
                    {product.isOrganic && product.organicCertificate?.status === 'approved' && <span className="badge organic">Organic</span>}
                    {product.isLocallySourced && <span className="badge local">Local</span>}
                  </div>
                </div>
                <div className="product-content">
                  <div className="merchant-info">
                    <div className="merchant-avatar">
                      {product.merchant?.businessInfo?.businessPhoto?.url ? (
                        <img src={getImageUrl(product.merchant.businessInfo.businessPhoto.url)} alt="Business" />
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
                  <div className="stock-info">
                    <span>
                      {product.inventory.quantity > 0 ? 
                        `${product.inventory.quantity} in stock` : 
                        'Out of stock'
                      }
                    </span>
                    {product.distance !== undefined && product.distance !== null && (
                      <span style={{ 
                        marginLeft: '1rem', 
                        color: 'var(--primary-green)', 
                        fontWeight: '500',
                        fontSize: '0.75rem'
                      }}>
                        📍 {product.distance} mi away
                      </span>
                    )}
                  </div>
                  
                  {(product.shipping?.deliveryTime?.sameDay || product.shipping?.canPickup) && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-dark)',
                      marginTop: '0.5rem',
                      display: 'flex',
                      gap: '0.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {product.shipping?.deliveryTime?.sameDay && (
                        <span style={{
                          background: 'var(--primary-green)',
                          color: 'white',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: '500'
                        }}>
                          Same Day
                        </span>
                      )}
                      {product.shipping?.canPickup && (
                        <span style={{
                          background: 'var(--accent-green)',
                          color: 'var(--text-dark)',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontWeight: '500'
                        }}>
                          Pickup
                        </span>
                      )}
                    </div>
                  )}
                  
                  {product.distance !== undefined && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {product.distance <= 10 ? 'Local' : `${product.distance.toFixed(1)} mi away`}
                      {product.merchant.businessInfo?.deliveryRadius && (
                        <span style={{ color: 'var(--primary-green)' }}>
                          • Delivers within {product.merchant.businessInfo.deliveryRadius}mi
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </ProductCard>
            ))}
          </ProductsGrid>

          {pagination.totalPages > 1 && (
            <Pagination>
              <button
                onClick={() => fetchProducts(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              >
                Previous
              </button>
              
              <div className="page-info">
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
              
              <button
                onClick={() => fetchProducts(pagination.currentPage + 1)}
                disabled={!pagination.hasMore}
              >
                Next
              </button>
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;