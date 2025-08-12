import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    isOrganic: searchParams.get('isOrganic') || '',
    sort: searchParams.get('sort') || '-createdAt'
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
    { value: 'name', label: 'Name A-Z' }
  ];

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(searchParams);
      params.set('page', page);
      
      const response = await axios.get(`/api/products?${params.toString()}`);
      setProducts(response.data.products);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
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
      if (value) {
        newParams.set(key, value);
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
      sort: '-createdAt'
    });
    setSearchParams({});
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
        {pagination.totalProducts !== undefined && (
          <div className="results-info">
            {pagination.totalProducts} products found
          </div>
        )}
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
          <div className="icon">🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search criteria or check back later for new products!</p>
        </EmptyState>
      ) : (
        <>
          <ProductsGrid>
            {products.map(product => (
              <ProductCard key={product._id} to={`/products/${product._id}`}>
                <div className="product-image">
                  {product.images?.[0] ? (
                    <img src={product.images[0].url} alt={product.name} />
                  ) : (
                    '📷'
                  )}
                  <div className="badges">
                    {product.isOrganic && <span className="badge organic">Organic</span>}
                    {product.isLocallySourced && <span className="badge local">Local</span>}
                  </div>
                </div>
                <div className="product-content">
                  <div className="merchant-info">
                    <div className="merchant-avatar">
                      {product.merchant?.businessInfo?.businessName?.[0] || 
                       product.merchant?.name?.[0] || '?'}
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
                    {product.inventory.quantity > 0 ? 
                      `${product.inventory.quantity} in stock` : 
                      'Out of stock'
                    }
                  </div>
                  
                  {product.merchant?.address?.zipCode && (
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-light)',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      📍 {product.merchant.address.zipCode}
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