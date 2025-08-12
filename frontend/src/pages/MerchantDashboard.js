import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import styled from 'styled-components';
import ImageUpload from '../components/ImageUpload';

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

  h1 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-light);
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
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: 2px solid var(--primary-green);
  background: ${props => props.active ? 'var(--primary-green)' : 'white'};
  color: ${props => props.active ? 'white' : 'var(--primary-green)'};
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: var(--primary-green);
    color: white;
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

const ProductForm = styled.form`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  input, textarea, select {
    width: 100%;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }

  &.full-width {
    grid-column: 1 / -1;
  }
`;

const ProductList = styled.div`
  display: grid;
  gap: 1rem;
`;

const ProductCard = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  gap: 1rem;

  .product-image {
    width: 60px;
    height: 60px;
    background: var(--natural-beige);
    border-radius: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
  }

  .product-info {
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

  .product-stats {
    text-align: right;

    .price {
      font-weight: 600;
      color: var(--primary-green);
      margin-bottom: 0.25rem;
    }

    .stock {
      font-size: 0.875rem;
      color: var(--text-light);
    }
  }

  .product-actions {
    display: flex;
    gap: 0.5rem;

    button {
      padding: 0.5rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;

      &.edit {
        background: var(--primary-green-light);
        color: white;
      }

      &.delete {
        background: #ef4444;
        color: white;
      }
    }
  }
`;

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    quantity: '',
    unit: 'piece',
    isOrganic: false,
    tags: '',
    images: [],
    shipping: {
      weight: '',
      canPickup: true,
      canDeliver: true,
      deliveryFee: '',
      deliveryTime: {
        standard: 1,
        sameDay: false
      }
    }
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const categories = [
    'produce', 'dairy', 'meat', 'seafood', 'bakery', 'beverages',
    'prepared-foods', 'snacks', 'condiments', 'spices', 'health',
    'beauty', 'home', 'crafts', 'flowers', 'other'
  ];

  const units = [
    'piece', 'pound', 'ounce', 'gram', 'kilogram', 
    'liter', 'gallon', 'quart', 'pint', 'bunch', 'dozen', 'package'
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products/my-products');
      setProducts(response.data.products);
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('shipping.')) {
      const shippingField = name.split('.')[1];
      if (shippingField === 'deliveryTime') {
        const timeField = name.split('.')[2];
        setProductForm({
          ...productForm,
          shipping: {
            ...productForm.shipping,
            deliveryTime: {
              ...productForm.shipping.deliveryTime,
              [timeField]: type === 'checkbox' ? checked : value
            }
          }
        });
      } else {
        setProductForm({
          ...productForm,
          shipping: {
            ...productForm.shipping,
            [shippingField]: type === 'checkbox' ? checked : value
          }
        });
      }
    } else {
      setProductForm({
        ...productForm,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        inventory: {
          quantity: parseInt(productForm.quantity),
          unit: productForm.unit
        },
        tags: productForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        images: productForm.images,
        shipping: {
          ...productForm.shipping,
          weight: productForm.shipping.weight ? parseFloat(productForm.shipping.weight) : undefined,
          deliveryFee: productForm.shipping.deliveryFee ? parseFloat(productForm.shipping.deliveryFee) : 0,
          deliveryTime: {
            standard: parseInt(productForm.shipping.deliveryTime.standard),
            sameDay: productForm.shipping.deliveryTime.sameDay
          }
        }
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData);
        alert('Product updated successfully!');
      } else {
        await axios.post('/api/products', productData);
        alert('Product created successfully!');
      }

      setProductForm({
        name: '',
        description: '',
        price: '',
        category: '',
        subcategory: '',
        quantity: '',
        unit: 'piece',
        isOrganic: false,
        tags: '',
        images: [],
        shipping: {
          weight: '',
          canPickup: true,
          canDeliver: true,
          deliveryFee: '',
          deliveryTime: {
            standard: 1,
            sameDay: false
          }
        }
      });
      setEditingProduct(null);
      fetchProducts();
      setActiveTab('products');
    } catch (error) {
      console.error('Error saving product:', error);
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleEditProduct = (product) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      subcategory: product.subcategory,
      quantity: product.inventory.quantity.toString(),
      unit: product.inventory.unit,
      isOrganic: product.isOrganic,
      tags: product.tags.join(', '),
      images: product.images || [],
      shipping: {
        weight: product.shipping?.weight?.toString() || '',
        canPickup: product.shipping?.canPickup !== false,
        canDeliver: product.shipping?.canDeliver !== false,
        deliveryFee: product.shipping?.deliveryFee?.toString() || '',
        deliveryTime: {
          standard: product.shipping?.deliveryTime?.standard || 1,
          sameDay: product.shipping?.deliveryTime?.sameDay || false
        }
      }
    });
    setEditingProduct(product);
    setActiveTab('add-product');
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        fetchProducts();
        alert('Product deleted successfully!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm({
      name: '',
      description: '',
      price: '',
      category: '',
      subcategory: '',
      quantity: '',
      unit: 'piece',
      isOrganic: false,
      tags: '',
      images: [],
      shipping: {
        weight: '',
        canPickup: true,
        canDeliver: true,
        deliveryFee: '',
        deliveryTime: {
          standard: 1,
          sameDay: false
        }
      }
    });
  };

  const renderOverview = () => (
    <>
      <StatsGrid>
        <StatCard>
          <div className="icon">📦</div>
          <div className="number">{stats.totalProducts || 0}</div>
          <div className="label">Total Products</div>
        </StatCard>
        <StatCard>
          <div className="icon">✅</div>
          <div className="number">{stats.activeProducts || 0}</div>
          <div className="label">Active Products</div>
        </StatCard>
        <StatCard>
          <div className="icon">👀</div>
          <div className="number">{stats.totalViews || 0}</div>
          <div className="label">Total Views</div>
        </StatCard>
        <StatCard>
          <div className="icon">⭐</div>
          <div className="number">{stats.averageRating?.toFixed(1) || 'N/A'}</div>
          <div className="label">Avg Rating</div>
        </StatCard>
      </StatsGrid>

      <Section>
        <SectionHeader>
          <h2>Recent Products</h2>
          <button 
            className="btn-primary"
            onClick={() => setActiveTab('products')}
          >
            View All
          </button>
        </SectionHeader>
        <SectionContent>
          {products.slice(0, 3).map(product => (
            <ProductCard key={product._id}>
              <div className="product-image">
                {product.images?.[0] ? 
                  <img src={product.images[0].url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem'}} /> :
                  '📷'
                }
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.category} • {product.inventory.quantity} {product.inventory.unit}</p>
              </div>
              <div className="product-stats">
                <div className="price">${product.price}</div>
                <div className="stock">{product.inventory.quantity > 0 ? 'In Stock' : 'Out of Stock'}</div>
              </div>
            </ProductCard>
          ))}
        </SectionContent>
      </Section>
    </>
  );

  const renderProducts = () => (
    <Section>
      <SectionHeader>
        <h2>My Products ({products.length})</h2>
        <button 
          className="btn-primary"
          onClick={() => setActiveTab('add-product')}
        >
          Add New Product
        </button>
      </SectionHeader>
      <SectionContent>
        <ProductList>
          {products.map(product => (
            <ProductCard key={product._id}>
              <div className="product-image">
                {product.images?.[0] ? 
                  <img src={product.images[0].url} alt={product.name} style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem'}} /> :
                  '📷'
                }
              </div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>{product.description.substring(0, 100)}...</p>
                <p><strong>{product.category}</strong> • {product.inventory.quantity} {product.inventory.unit}</p>
              </div>
              <div className="product-stats">
                <div className="price">${product.price}</div>
                <div className="stock">
                  {product.inventory.quantity > 0 ? 
                    `${product.inventory.quantity} in stock` : 
                    'Out of stock'
                  }
                </div>
                <div style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>
                  {product.views} views • {product.rating.count} reviews
                </div>
              </div>
              <div className="product-actions">
                <button 
                  className="edit"
                  onClick={() => handleEditProduct(product)}
                >
                  Edit
                </button>
                <button 
                  className="delete"
                  onClick={() => handleDeleteProduct(product._id)}
                >
                  Delete
                </button>
              </div>
            </ProductCard>
          ))}
        </ProductList>
      </SectionContent>
    </Section>
  );

  const renderAddProduct = () => (
    <Section>
      <SectionHeader>
        <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
        {editingProduct && (
          <button 
            onClick={handleCancelEdit}
            className="btn-secondary"
            style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
          >
            Cancel Edit
          </button>
        )}
      </SectionHeader>
      <SectionContent>
        <ImageUpload
          images={productForm.images}
          onImagesChange={(images) => setProductForm({...productForm, images})}
        />
        
        <ProductForm onSubmit={handleSubmitProduct}>
          <FormGroup>
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              value={productForm.name}
              onChange={handleFormChange}
              required
              placeholder="e.g., Fresh Organic Tomatoes"
            />
          </FormGroup>

          <FormGroup>
            <label>Price ($)</label>
            <input
              type="number"
              name="price"
              value={productForm.price}
              onChange={handleFormChange}
              required
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup>
            <label>Category</label>
            <select
              name="category"
              value={productForm.category}
              onChange={handleFormChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup>
            <label>Subcategory</label>
            <input
              type="text"
              name="subcategory"
              value={productForm.subcategory}
              onChange={handleFormChange}
              required
              placeholder="e.g., Cherry Tomatoes"
            />
          </FormGroup>

          <FormGroup>
            <label>Quantity</label>
            <input
              type="number"
              name="quantity"
              value={productForm.quantity}
              onChange={handleFormChange}
              required
              min="0"
              placeholder="0"
            />
          </FormGroup>

          <FormGroup>
            <label>Unit</label>
            <select
              name="unit"
              value={productForm.unit}
              onChange={handleFormChange}
              required
            >
              {units.map(unit => (
                <option key={unit} value={unit}>
                  {unit.charAt(0).toUpperCase() + unit.slice(1)}
                </option>
              ))}
            </select>
          </FormGroup>

          <FormGroup className="full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={productForm.description}
              onChange={handleFormChange}
              required
              placeholder="Describe your product, including freshness, origin, and any special qualities..."
            />
          </FormGroup>

          <FormGroup className="full-width">
            <label>Tags (comma-separated)</label>
            <input
              type="text"
              name="tags"
              value={productForm.tags}
              onChange={handleFormChange}
              placeholder="organic, local, fresh, seasonal"
            />
          </FormGroup>

          <FormGroup className="full-width">
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                name="isOrganic"
                checked={productForm.isOrganic}
                onChange={handleFormChange}
                style={{width: 'auto'}}
              />
              This product is certified organic
            </label>
          </FormGroup>

          <FormGroup className="full-width">
            <h4 style={{color: 'var(--text-dark)', marginBottom: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem'}}>
              🚚 Shipping & Delivery Options
            </h4>
          </FormGroup>

          <FormGroup>
            <label>Item Weight (lbs)</label>
            <input
              type="number"
              name="shipping.weight"
              value={productForm.shipping.weight}
              onChange={handleFormChange}
              min="0"
              step="0.1"
              placeholder="0.5"
            />
          </FormGroup>

          <FormGroup>
            <label>Delivery Fee ($)</label>
            <input
              type="number"
              name="shipping.deliveryFee"
              value={productForm.shipping.deliveryFee}
              onChange={handleFormChange}
              min="0"
              step="0.01"
              placeholder="0.00"
            />
          </FormGroup>

          <FormGroup className="full-width">
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                name="shipping.canPickup"
                checked={productForm.shipping.canPickup}
                onChange={handleFormChange}
                style={{width: 'auto'}}
              />
              Available for pickup
            </label>
          </FormGroup>

          <FormGroup className="full-width">
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                name="shipping.canDeliver"
                checked={productForm.shipping.canDeliver}
                onChange={handleFormChange}
                style={{width: 'auto'}}
              />
              Available for delivery
            </label>
          </FormGroup>

          <FormGroup>
            <label>Standard Delivery (days)</label>
            <select
              name="shipping.deliveryTime.standard"
              value={productForm.shipping.deliveryTime.standard}
              onChange={handleFormChange}
            >
              <option value={1}>1 day</option>
              <option value={2}>2 days</option>
              <option value={3}>3 days</option>
              <option value={5}>5 days</option>
              <option value={7}>1 week</option>
            </select>
          </FormGroup>

          <FormGroup className="full-width">
            <label style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <input
                type="checkbox"
                name="shipping.deliveryTime.sameDay"
                checked={productForm.shipping.deliveryTime.sameDay}
                onChange={handleFormChange}
                style={{width: 'auto'}}
              />
              Offer same-day delivery
            </label>
          </FormGroup>

          <FormGroup className="full-width">
            <button type="submit" className="btn-primary">
              {editingProduct ? 'Update Product' : 'Create Product'}
            </button>
          </FormGroup>
        </ProductForm>
      </SectionContent>
    </Section>
  );

  if (loading) {
    return (
      <Container>
        <div style={{textAlign: 'center', padding: '3rem'}}>Loading...</div>
      </Container>
    );
  }

  return (
    <Container>
      <Welcome>
        <h1>👋 Welcome, {user?.businessInfo?.businessName || user?.name}!</h1>
        <p>Manage your products, track sales, and grow your local business.</p>
      </Welcome>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </TabButton>
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
          >
            📦 Products
          </TabButton>
          <TabButton 
            active={activeTab === 'add-product'} 
            onClick={() => setActiveTab('add-product')}
          >
            ➕ Add Product
          </TabButton>
          <TabButton 
            active={activeTab === 'orders'} 
            onClick={() => setActiveTab('orders')}
          >
            📋 Orders
          </TabButton>
        </TabButtons>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'add-product' && renderAddProduct()}
        {activeTab === 'orders' && (
          <Section>
            <SectionHeader>
              <h2>Orders</h2>
            </SectionHeader>
            <SectionContent>
              <p>Order management coming soon!</p>
            </SectionContent>
          </Section>
        )}
      </TabContainer>
    </Container>
  );
};

export default MerchantDashboard;