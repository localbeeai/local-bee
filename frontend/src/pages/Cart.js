import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  .breadcrumb {
    color: var(--text-light);
    font-size: 0.875rem;

    a {
      color: var(--primary-green);
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 80px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-light);

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 60px 1fr;
    gap: 0.75rem;
    grid-template-areas:
      "image info"
      "image controls";
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    grid-template-areas:
      "info"
      "image"
      "controls";
    text-align: center;
  }

  .product-image {
    width: 80px;
    height: 80px;
    border-radius: 0.5rem;
    overflow: hidden;
    background: var(--natural-beige);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    @media (max-width: 768px) {
      grid-area: image;
    }
    
    @media (max-width: 480px) {
      width: 120px;
      height: 120px;
      justify-self: center;
      margin: 0.5rem 0;
    }
  }

  .product-info {
    
    @media (max-width: 768px) {
      grid-area: info;
    }
    
    .name {
      font-weight: 600;
      color: var(--text-dark);
      margin-bottom: 0.25rem;
    }

    .merchant {
      color: var(--text-light);
      font-size: 0.875rem;
    }

    .price {
      color: var(--primary-green);
      font-weight: 600;
      margin-top: 0.25rem;
    }
    
    .mobile-controls {
      display: none; // Hidden on desktop
    }
    
    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      
      .mobile-controls {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 0.75rem;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }
  }

  .quantity-controls {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    border: 1px solid var(--border-light);
    border-radius: 0.25rem;
    padding: 0.25rem;
    
    @media (max-width: 768px) {
      display: none; // Will be shown in mobile-controls
    }

    button {
      background: none;
      border: none;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--text-dark);

      &:hover {
        background: var(--natural-beige);
        border-radius: 0.125rem;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .quantity {
      min-width: 30px;
      text-align: center;
      font-weight: 600;
    }
  }

  .item-total {
    font-weight: 600;
    color: var(--text-dark);
    
    @media (max-width: 768px) {
      display: none; // Will be shown in mobile-controls
    }
  }

  .remove-button {
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 0.25rem;
    
    @media (max-width: 768px) {
      display: none; // Will be shown in mobile-controls
    }

    &:hover {
      background: #fee2e2;
      color: #dc2626;
    }
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow);
  height: fit-content;

  h3 {
    color: var(--text-dark);
    margin-bottom: 1.5rem;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;

  &.total {
    font-weight: 600;
    font-size: 1.1rem;
    color: var(--text-dark);
    border-top: 1px solid var(--border-light);
    padding-top: 1rem;
    margin-top: 1rem;
  }

  .label {
    color: var(--text-light);
  }

  .value {
    color: var(--text-dark);
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: var(--primary-green);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-green-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);

  .icon {
    font-size: 4rem;
    margin-bottom: 1rem;
  }

  h2 {
    color: var(--text-dark);
    margin-bottom: 1rem;
  }

  p {
    color: var(--text-light);
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .btn-primary {
    background: var(--primary-green);
    color: white;
    text-decoration: none;
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-weight: 600;
    display: inline-block;
    transition: background-color 0.2s;

    &:hover {
      background: var(--primary-green-dark);
    }
  }
`;

const ContinueShoppingLink = styled(Link)`
  color: var(--primary-green);
  text-decoration: none;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 1rem;

  &:hover {
    text-decoration: underline;
  }

  &:before {
    content: '← ';
  }
`;

const Cart = () => {
  const { items, updateQuantity, removeFromCart, getCartTotal, getCartItemCount, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  if (loading) {
    return (
      <Container>
        <PageHeader>
          <h1>🛒 Shopping Cart</h1>
        </PageHeader>
        <div>Loading cart...</div>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container>
        <PageHeader>
          <h1>🛒 Shopping Cart</h1>
          <div className="breadcrumb">
            <Link to="/">Home</Link> / Cart
          </div>
        </PageHeader>

        <EmptyCart>
          <div className="icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>
            Looks like you haven't added any items to your cart yet.<br />
            Start shopping to find great local products!
          </p>
          <Link to="/products" className="btn-primary">
            Start Shopping
          </Link>
        </EmptyCart>
      </Container>
    );
  }

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  return (
    <Container>
      <PageHeader>
        <h1>🛒 Shopping Cart ({getCartItemCount()} items)</h1>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / Cart
        </div>
      </PageHeader>

      <CartContent>
        <div>
          <ContinueShoppingLink to="/products">
            Continue Shopping
          </ContinueShoppingLink>

          <CartItems>
            {items.map((item) => (
              <CartItem key={item.product._id}>
                <div className="product-image">
                  {item.product.images?.[0] ? (
                    <img src={getImageUrl(item.product.images[0].url)} alt={item.product.name} />
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
                      📦
                    </div>
                  )}
                </div>

                <div className="product-info">
                  <div className="name">{item.product.name}</div>
                  <div className="merchant">
                    by {item.product.merchant?.businessInfo?.businessName || item.product.merchant?.name}
                  </div>
                  <div className="price">{formatPrice(item.product.price)} each</div>
                  
                  <div className="mobile-controls">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border-light)', borderRadius: '0.25rem', padding: '0.25rem' }}>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--text-dark)'
                        }}
                      >
                        −
                      </button>
                      <span style={{ minWidth: '30px', textAlign: 'center', fontWeight: '600' }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                        style={{
                          background: 'none',
                          border: 'none',
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          color: 'var(--text-dark)'
                        }}
                      >
                        +
                      </button>
                    </div>
                    
                    <div style={{ fontWeight: '600', color: 'var(--text-dark)' }}>
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                    
                    <button
                      onClick={() => removeFromCart(item.product._id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-light)',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '0.25rem'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="quantity-controls">
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    −
                  </button>
                  <span className="quantity">{item.quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>

                <div className="item-total">
                  {formatPrice(item.product.price * item.quantity)}
                </div>

                <button
                  className="remove-button"
                  onClick={() => removeFromCart(item.product._id)}
                  title="Remove from cart"
                >
                  🗑️
                </button>
              </CartItem>
            ))}
          </CartItems>
        </div>

        <CartSummary>
          <h3>Order Summary</h3>
          
          <SummaryItem>
            <span className="label">Subtotal ({getCartItemCount()} items)</span>
            <span className="value">{formatPrice(subtotal)}</span>
          </SummaryItem>

          <SummaryItem>
            <span className="label">
              Shipping {subtotal > 50 && <span style={{ color: 'var(--primary-green)' }}>FREE</span>}
            </span>
            <span className="value">{formatPrice(shipping)}</span>
          </SummaryItem>

          <SummaryItem>
            <span className="label">Tax</span>
            <span className="value">{formatPrice(tax)}</span>
          </SummaryItem>

          {subtotal < 50 && (
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', margin: '1rem 0', padding: '0.75rem', background: 'var(--secondary-green)', borderRadius: '0.25rem' }}>
              💡 Add {formatPrice(50 - subtotal)} more for free shipping!
            </div>
          )}

          <SummaryItem className="total">
            <span className="label">Total</span>
            <span className="value">{formatPrice(total)}</span>
          </SummaryItem>

          <CheckoutButton onClick={handleCheckout}>
            {user ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </CheckoutButton>

          <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>
            🔒 Secure checkout guaranteed
          </div>
        </CartSummary>
      </CartContent>
    </Container>
  );
};

export default Cart;