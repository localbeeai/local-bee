import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ContactSellerModal from '../components/ContactSellerModal';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageGallery = styled.div`
  .main-image {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 1rem;
    overflow: hidden;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
    gap: 0.5rem;

    .thumbnail {
      aspect-ratio: 1;
      border-radius: 0.5rem;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid ${props => props.isActive ? 'var(--primary-green)' : 'var(--border-light)'};
      transition: all 0.2s;

      &:hover {
        border-color: var(--primary-green);
        transform: translateY(-2px);
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
`;

const ProductInfo = styled.div`
  .badges {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 1rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: white;

      &.organic {
        background: #16a34a;
      }

      &.local {
        background: #0ea5e9;
      }

      &.featured {
        background: var(--primary-green);
      }
    }
  }

  h1 {
    font-size: 2.5rem;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  .category-info {
    color: var(--text-light);
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }

  .price-section {
    margin-bottom: 2rem;

    .price {
      font-size: 2rem;
      font-weight: 700;
      color: var(--primary-green);
      margin-bottom: 0.25rem;
    }

    .unit {
      color: var(--text-light);
      font-size: 1rem;
    }
  }

  .rating-section {
    margin-bottom: 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;

    .stars {
      color: #fbbf24;
      font-size: 1.25rem;
    }

    .rating-text {
      color: var(--text-light);
      font-size: 0.875rem;
    }
  }

  .stock-info {
    padding: 1rem;
    background: ${props => props.$inStock ? 'var(--secondary-green)' : '#fee2e2'};
    color: ${props => props.$inStock ? 'var(--primary-green)' : '#dc2626'};
    border-radius: 0.5rem;
    font-weight: 600;
    text-align: center;
    margin-bottom: 2rem;
  }

  .description {
    margin-bottom: 2rem;

    h3 {
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    p {
      color: var(--text-light);
      line-height: 1.6;
      margin-bottom: 1rem;
    }
  }

  .product-details {
    background: var(--natural-beige);
    padding: 1.5rem;
    border-radius: 1rem;
    margin-bottom: 2rem;

    h3 {
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 1rem;

      .detail-item {
        .label {
          font-weight: 600;
          color: var(--text-dark);
          font-size: 0.875rem;
        }

        .value {
          color: var(--text-light);
          font-size: 0.875rem;
        }
      }
    }
  }

  .tags {
    margin-bottom: 2rem;

    h3 {
      color: var(--text-dark);
      margin-bottom: 1rem;
    }

    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .tag {
        background: var(--accent-green);
        color: var(--text-dark);
        padding: 0.25rem 0.75rem;
        border-radius: 1rem;
        font-size: 0.875rem;
      }
    }
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  button, a {
    flex: 1;
    padding: 1rem 2rem;
    border-radius: 0.75rem;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s;
    cursor: pointer;
    border: none;

    &.primary {
      background: var(--primary-green);
      color: white;

      &:hover {
        background: var(--primary-green-dark);
        transform: translateY(-2px);
      }
    }

    &.secondary {
      background: white;
      color: var(--primary-green);
      border: 2px solid var(--primary-green);

      &:hover {
        background: var(--secondary-green);
      }
    }
  }
`;

const MerchantCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;

  .merchant-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;

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

      h3 {
        color: var(--text-dark);
        margin-bottom: 0.25rem;
        font-size: 1.25rem;
      }

      .location {
        color: var(--text-light);
        font-size: 0.875rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
      }
    }

    .visit-store {
      padding: 0.75rem 1.5rem;
      background: var(--primary-green);
      color: white;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;

      &:hover {
        background: var(--primary-green-dark);
      }
    }
  }

  .merchant-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-bottom: 1.5rem;

    .stat {
      text-align: center;

      .number {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--primary-green);
      }

      .label {
        font-size: 0.75rem;
        color: var(--text-light);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }
    }
  }

  .delivery-info {
    background: var(--natural-beige);
    padding: 1rem;
    border-radius: 0.75rem;

    h4 {
      color: var(--text-dark);
      margin-bottom: 0.5rem;
      font-size: 1rem;
    }

    .delivery-options {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;

      .option {
        background: white;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-dark);
        border: 1px solid var(--border-light);
      }
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

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart, isInCart, getCartItem } = useCart();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching product:', error);
      setError(error.response?.status === 404 ? 'Product not found' : 'Error loading product');
    } finally {
      setLoading(false);
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

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: `/products/${id}` } } });
      return;
    }

    if (product.inventory.quantity === 0) {
      return;
    }

    addToCart(product, 1);
    
    // Show a brief confirmation
    const button = document.querySelector('.primary');
    const originalText = button.textContent;
    button.textContent = 'Added to Cart!';
    button.style.background = 'var(--primary-green)';
    
    setTimeout(() => {
      if (isInCart(product._id)) {
        const cartItem = getCartItem(product._id);
        button.textContent = `In Cart (${cartItem.quantity})`;
      } else {
        button.textContent = originalText;
      }
    }, 2000);
  };

  const handleContactMerchant = () => {
    if (!user) {
      alert('Please log in to contact the seller');
      navigate('/login');
      return;
    }

    if (user.role === 'merchant' && product.merchant._id === user.id) {
      alert('You cannot message yourself');
      return;
    }

    setContactModalOpen(true);
  };

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading product details...</LoadingState>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <ErrorState>
          <div className="icon">😕</div>
          <h2>{error}</h2>
          <p>This product might have been removed or doesn't exist.</p>
          <Link to="/products" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            Browse Other Products
          </Link>
        </ErrorState>
      </Container>
    );
  }

  if (!product) {
    return null;
  }

  const images = product.images && product.images.length > 0 
    ? product.images 
    : [{ url: '/placeholder-product.png', alt: product.name }];

  const currentImage = images[selectedImageIndex] || images[0];
  const featuredImage = images.find(img => img.isFeatured) || images[0];

  return (
    <Container>
      <ProductGrid>
        <ImageGallery>
          <div className="main-image">
            <img 
              src={getImageUrl(currentImage.url)} 
              alt={currentImage.alt || product.name}
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />
          </div>
          
          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`thumbnail ${index === selectedImageIndex ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img 
                    src={getImageUrl(image.url)} 
                    alt={image.alt || `${product.name} ${index + 1}`}
                    onError={(e) => {
                      e.target.src = '/placeholder-product.png';
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </ImageGallery>

        <ProductInfo $inStock={product.inventory.quantity > 0}>
          <div className="badges">
            {product.isOrganic && product.organicCertificate?.status === 'approved' && <span className="badge organic">Organic</span>}
            {product.isLocallySourced && <span className="badge local">Local</span>}
            {product.featured && <span className="badge featured">Featured</span>}
            {product.shipping?.deliveryTime?.sameDay && <span className="badge" style={{background: '#f59e0b'}}>⚡ Same Day</span>}
            {product.shipping?.canPickup && <span className="badge" style={{background: '#8b5cf6'}}>🏪 Pickup</span>}
          </div>

          <h1>{product.name}</h1>
          
          <div className="category-info">
            {product.category.charAt(0).toUpperCase() + product.category.slice(1).replace('-', ' ')} • {product.subcategory}
          </div>

          <div className="price-section">
            <div className="price">${product.price}</div>
            <div className="unit">per {product.inventory.unit}</div>
          </div>

          {product.rating.count > 0 && (
            <div className="rating-section">
              <span className="stars">
                {renderStars(product.rating.average)}
              </span>
              <span className="rating-text">
                {product.rating.average.toFixed(1)} ({product.rating.count} review{product.rating.count !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          <div className="stock-info">
            {product.inventory.quantity > 0 
              ? `✅ ${product.inventory.quantity} in stock` 
              : '❌ Out of stock'
            }
          </div>

          <ActionButtons>
            <button 
              className="primary"
              onClick={handleAddToCart}
              disabled={product.inventory.quantity === 0}
            >
              {product.inventory.quantity === 0 
                ? 'Out of Stock' 
                : isInCart(product._id) 
                  ? `In Cart (${getCartItem(product._id)?.quantity || 0})` 
                  : 'Add to Cart'
              }
            </button>
            <button 
              className="secondary"
              onClick={handleContactMerchant}
            >
              Contact Seller
            </button>
          </ActionButtons>

          <div className="description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-details">
            <h3>Product Details</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <div className="label">Category</div>
                <div className="value">{product.category.replace('-', ' ')}</div>
              </div>
              <div className="detail-item">
                <div className="label">Subcategory</div>
                <div className="value">{product.subcategory}</div>
              </div>
              <div className="detail-item">
                <div className="label">Unit</div>
                <div className="value">{product.inventory.unit}</div>
              </div>
              {product.isOrganic && product.organicCertificate?.status === 'approved' && (
                <div className="detail-item">
                  <div className="label">Certification</div>
                  <div className="value">Certified Organic</div>
                </div>
              )}
              {product.harvestDate && (
                <div className="detail-item">
                  <div className="label">Harvest Date</div>
                  <div className="value">{new Date(product.harvestDate).toLocaleDateString()}</div>
                </div>
              )}
            </div>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div className="tags">
              <h3>Tags</h3>
              <div className="tag-list">
                {product.tags.map((tag, index) => (
                  <span key={index} className="tag">{tag}</span>
                ))}
              </div>
            </div>
          )}
        </ProductInfo>
      </ProductGrid>

      {product.merchant && (
        <MerchantCard>
          <div className="merchant-header">
            <div className="merchant-avatar">
              {product.merchant.businessInfo?.businessPhoto?.url ? (
                <img src={getImageUrl(product.merchant.businessInfo.businessPhoto.url)} alt="Business" />
              ) : (
                product.merchant.businessInfo?.businessName?.[0] || 
                product.merchant.name?.[0] || 
                '?'
              )}
            </div>
            <div className="merchant-info">
              <h3>{product.merchant.businessInfo?.businessName || product.merchant.name}</h3>
              <div className="location">
                {product.merchant.address?.city || 'Local Area'}
                {product.merchant.address?.zipCode && (
                  <span>, {product.merchant.address.zipCode}</span>
                )}
              </div>
            </div>
            <Link 
              to={`/merchant/${product.merchant._id}`}
              className="visit-store"
            >
              Visit Store
            </Link>
          </div>

          <div className="merchant-stats">
            <div className="stat">
              <div className="number">4.8</div>
              <div className="label">Rating</div>
            </div>
            <div className="stat">
              <div className="number">127</div>
              <div className="label">Products</div>
            </div>
            <div className="stat">
              <div className="number">2.1K</div>
              <div className="label">Sales</div>
            </div>
            <div className="stat">
              <div className="number">98%</div>
              <div className="label">Response</div>
            </div>
          </div>

          <div className="delivery-info">
            <h4>Delivery Options</h4>
            <div className="delivery-options">
              {product.merchant.businessInfo?.offersPickup && (
                <div className="option">Pickup Available</div>
              )}
              {product.merchant.businessInfo?.offersDelivery && (
                <div className="option">Local Delivery</div>
              )}
              {product.merchant.businessInfo?.sameDayDelivery && (
                <div className="option">Same-Day Delivery</div>
              )}
              {product.merchant.businessInfo?.deliveryRadius && (
                <div className="option">
                  Delivers within {product.merchant.businessInfo.deliveryRadius}mi
                </div>
              )}
            </div>
          </div>
        </MerchantCard>
      )}

      <ContactSellerModal
        isOpen={contactModalOpen}
        onClose={() => setContactModalOpen(false)}
        product={product}
        user={user}
      />
    </Container>
  );
};

export default ProductDetail;