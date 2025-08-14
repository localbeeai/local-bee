import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';
import ImageUpload from '../components/ImageUpload';
import Messages from '../components/Messages';
import ShippingCommitmentModal from '../components/ShippingCommitmentModal';

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

  .business-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 50%;
    }
    border: 3px solid white;
    box-shadow: var(--shadow);
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
      
      &.description {
        margin-bottom: 0.5rem;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 2.4em;
      }
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

const OrderCard = styled.div`
  background: white;
  border: 1px solid var(--border-light);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: var(--shadow);

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-light);

    .order-info {
      .order-number {
        font-weight: 600;
        color: var(--text-dark);
        font-size: 1.125rem;
      }
      
      .order-date {
        color: var(--text-light);
        font-size: 0.875rem;
        margin-top: 0.25rem;
      }
    }

    .order-status {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
      
      &.pending {
        background: #fef3c7;
        color: #f59e0b;
      }
      
      &.confirmed {
        background: #dbeafe;
        color: #3b82f6;
      }
      
      &.preparing {
        background: #f3e8ff;
        color: #9333ea;
      }
      
      &.ready-for-pickup {
        background: #fef3c7;
        color: #d97706;
      }
      
      &.out-for-delivery {
        background: #e0e7ff;
        color: #6366f1;
      }
      
      &.shipped {
        background: #e0e7ff;
        color: #6366f1;
      }
      
      &.delivered {
        background: #dcfce7;
        color: #16a34a;
      }
      
      &.cancelled {
        background: #fee2e2;
        color: #dc2626;
      }
      
      &.returned {
        background: #fef3c7;
        color: #f59e0b;
      }
    }
  }

  .customer-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    .customer-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: var(--primary-green-light);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      color: var(--primary-green);
    }

    .customer-details {
      .customer-name {
        font-weight: 600;
        color: var(--text-dark);
      }
      
      .customer-contact {
        color: var(--text-light);
        font-size: 0.875rem;
      }
    }
  }

  .order-items {
    margin-bottom: 1rem;

    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
      border-bottom: 1px solid var(--border-light);

      &:last-child {
        border-bottom: none;
      }

      .item-info {
        .item-name {
          font-weight: 500;
          color: var(--text-dark);
        }
        
        .item-details {
          color: var(--text-light);
          font-size: 0.875rem;
        }
      }

      .item-total {
        font-weight: 600;
        color: var(--primary-green);
      }
    }
  }

  .order-totals {
    background: var(--natural-beige);
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1rem;

    .total-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;

      &.final {
        font-weight: 600;
        font-size: 1.125rem;
        color: var(--primary-green);
        border-top: 1px solid var(--border-light);
        padding-top: 0.5rem;
        margin-top: 0.5rem;
      }
    }
  }

  .order-timeline {
    margin-bottom: 1.5rem;
    
    h4 {
      color: var(--text-dark);
      margin-bottom: 1rem;
      font-size: 1rem;
    }
    
    .timeline-event {
      display: flex;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .timeline-dot {
        width: 10px;
        height: 10px;
        background: var(--primary-green);
        border-radius: 50%;
        margin-top: 0.25rem;
        flex-shrink: 0;
      }
      
      .timeline-content {
        flex: 1;
        
        .timeline-status {
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }
        
        .timeline-time {
          color: var(--text-light);
          font-size: 0.875rem;
          margin-bottom: 0.25rem;
        }
        
        .timeline-note {
          color: var(--text-light);
          font-size: 0.875rem;
          font-style: italic;
        }
      }
    }
  }
  
  .tracking-info {
    background: #f0f9ff;
    padding: 1rem;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    border-left: 4px solid #0ea5e9;
    
    h4 {
      color: var(--text-dark);
      margin-bottom: 0.75rem;
      font-size: 1rem;
    }
    
    .tracking-details {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      a {
        color: var(--primary-green);
        text-decoration: none;
        font-weight: 500;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .order-actions {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    .action-btn {
      padding: 0.5rem 1rem;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;

      &.primary {
        background: var(--primary-green);
        color: white;
      }

      &.secondary {
        background: var(--natural-beige);
        color: var(--text-dark);
        border: 1px solid var(--border-light);
      }

      &.danger {
        background: #ef4444;
        color: white;
      }
    }
  }
`;

const MerchantDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [shippingModalOpen, setShippingModalOpen] = useState(false);
  const [hasShippingCommitment, setHasShippingCommitment] = useState(false);
  const [productForm, setProductForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    subcategory: '',
    quantity: '',
    unit: 'piece',
    isOrganic: false,
    organicCertificate: null,
    tags: '',
    images: [],
    fulfillment: {
      method: 'pickup-only', // 'pickup-only', 'delivery-only', 'both'
      pickupInstructions: '',
      deliveryOptions: {
        localDelivery: false,
        deliveryRadius: 5, // miles
        deliveryFee: 0,
        freeDeliveryMinimum: 25, // free delivery over this amount
        estimatedTime: '1-2 hours' // or 'same-day', 'next-day'
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
    if (activeTab === 'orders') {
      fetchOrders();
    }
  }, [activeTab]);

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

  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const response = await axios.get('/api/orders/merchant');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('fulfillment.')) {
      const fieldPath = name.split('.');
      if (fieldPath.length === 2) {
        // Direct fulfillment field (e.g., fulfillment.method)
        setProductForm({
          ...productForm,
          fulfillment: {
            ...productForm.fulfillment,
            [fieldPath[1]]: type === 'checkbox' ? checked : value
          }
        });
      } else if (fieldPath.length === 3 && fieldPath[1] === 'deliveryOptions') {
        // Nested deliveryOptions field (e.g., fulfillment.deliveryOptions.deliveryFee)
        setProductForm({
          ...productForm,
          fulfillment: {
            ...productForm.fulfillment,
            deliveryOptions: {
              ...productForm.fulfillment.deliveryOptions,
              [fieldPath[2]]: type === 'checkbox' ? checked : (type === 'number' ? parseFloat(value) || 0 : value)
            }
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

  const handleShippingCommitment = (shippingOptions) => {
    setHasShippingCommitment(true);
    // Update form with the selected shipping commitments
    setProductForm(prev => ({
      ...prev,
      shipping: {
        ...prev.shipping,
        commitmentLevels: shippingOptions,
        commitmentLevel: shippingOptions[0] // Keep for backward compatibility
      }
    }));
  };

  const handleCertificateUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only PDF and image files are allowed.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('certificate', file);

      const response = await axios.post('/api/upload/organic-certificate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setProductForm(prev => ({
        ...prev,
        organicCertificate: {
          url: response.data.url,
          filename: response.data.filename,
          originalName: file.name,
          status: 'pending'
        }
      }));

      alert('Certificate uploaded successfully! It will be reviewed by our team.');
    } catch (error) {
      console.error('Error uploading certificate:', error);
      alert(error.response?.data?.message || 'Failed to upload certificate');
    }
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    
    // Check if organic product has certificate
    if (productForm.isOrganic && !productForm.organicCertificate) {
      alert('Please upload an organic certification document for organic products.');
      return;
    }
    
    // No shipping commitment needed with new fulfillment system
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
        fulfillment: {
          ...productForm.fulfillment,
          deliveryOptions: {
            ...productForm.fulfillment.deliveryOptions,
            deliveryFee: productForm.fulfillment.deliveryOptions.deliveryFee ? parseFloat(productForm.fulfillment.deliveryOptions.deliveryFee) : 0,
            deliveryRadius: productForm.fulfillment.deliveryOptions.deliveryRadius ? parseFloat(productForm.fulfillment.deliveryOptions.deliveryRadius) : 5,
            freeDeliveryMinimum: productForm.fulfillment.deliveryOptions.freeDeliveryMinimum ? parseFloat(productForm.fulfillment.deliveryOptions.freeDeliveryMinimum) : 25
          }
        }
      };

      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData);
        alert('Product updated successfully!');
        // Don't redirect for updates, stay on the form
        fetchProducts(); // Refresh the products list
      } else {
        await axios.post('/api/products', productData);
        alert('Product created successfully!');
        // For new products, reset form and go to products tab
        setProductForm({
          name: '',
          description: '',
          price: '',
          category: '',
          subcategory: '',
          quantity: '',
          unit: 'piece',
          isOrganic: false,
          organicCertificate: null,
          tags: '',
          images: [],
          fulfillment: {
            method: 'pickup-only',
            pickupInstructions: '',
            deliveryOptions: {
              localDelivery: false,
              deliveryRadius: 5,
              deliveryFee: 0,
              freeDeliveryMinimum: 25,
              estimatedTime: '1-2 hours'
            }
          }
        });
        setActiveTab('products');
        fetchProducts();
      }
      setHasShippingCommitment(false);
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
      organicCertificate: product.organicCertificate || null,
      tags: product.tags.join(', '),
      images: product.images || [],
      fulfillment: {
        method: product.fulfillment?.method || (product.shipping?.canPickup && product.shipping?.canDeliver ? 'both' : product.shipping?.canDeliver ? 'delivery-only' : 'pickup-only'),
        pickupInstructions: product.fulfillment?.pickupInstructions || '',
        deliveryOptions: {
          localDelivery: product.fulfillment?.deliveryOptions?.localDelivery || product.shipping?.canDeliver || false,
          deliveryRadius: product.fulfillment?.deliveryOptions?.deliveryRadius || product.shipping?.deliveryRange || 5,
          deliveryFee: product.fulfillment?.deliveryOptions?.deliveryFee || product.shipping?.deliveryFee || 0,
          freeDeliveryMinimum: product.fulfillment?.deliveryOptions?.freeDeliveryMinimum || 25,
          estimatedTime: product.fulfillment?.deliveryOptions?.estimatedTime || '1-2 hours'
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
      organicCertificate: null,
      tags: '',
      images: [],
      fulfillment: {
        method: 'pickup-only',
        pickupInstructions: '',
        deliveryOptions: {
          localDelivery: false,
          deliveryRadius: 5,
          deliveryFee: 0,
          freeDeliveryMinimum: 25,
          estimatedTime: '1-2 hours'
        }
      }
    });
    setHasShippingCommitment(false);
  };

  const updateOrderStatus = async (orderId, newStatus, trackingInfo = null) => {
    try {
      const updateData = { status: newStatus };
      if (trackingInfo) {
        updateData.shipping = trackingInfo;
      }
      
      await axios.put(`/api/orders/${orderId}/status`, updateData);
      
      // Refresh orders
      fetchOrders();
      alert(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating order status:', error);
      alert(error.response?.data?.message || 'Failed to update order status');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderOrdersPage = () => (
    <Section>
      <SectionHeader>
        <h2>Orders Management</h2>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-light)' }}>
          {orders.length} total orders
        </div>
      </SectionHeader>
      <SectionContent>
        {ordersLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <div>Loading orders...</div>
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
            <h3>No orders yet</h3>
            <p>Orders from customers will appear here</p>
          </div>
        ) : (
          orders.map(order => (
            <OrderCard key={order._id}>
              <div className="order-header">
                <div className="order-info">
                  <div className="order-number">Order #{order.orderNumber || order._id.slice(-8)}</div>
                  <div className="order-date">{formatDate(order.createdAt)}</div>
                </div>
                <div className={`order-status ${order.status}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div className="customer-info">
                <div className="customer-avatar">
                  {order.customer.name?.[0]?.toUpperCase() || '👤'}
                </div>
                <div className="customer-details">
                  <div className="customer-name">{order.customer.name}</div>
                  <div className="customer-contact">{order.customer.email}</div>
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="item">
                    <div className="item-info">
                      <div className="item-name">{item.product.name}</div>
                      <div className="item-details">
                        Quantity: {item.quantity} {item.product.inventory?.unit} × ${item.price}
                      </div>
                    </div>
                    <div className="item-total">${(item.quantity * item.price).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="order-totals">
                <div className="total-row">
                  <span>Subtotal:</span>
                  <span>${order.subtotal?.toFixed(2) || '0.00'}</span>
                </div>
                {order.deliveryFee > 0 && (
                  <div className="total-row">
                    <span>Delivery Fee:</span>
                    <span>${order.deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="total-row final">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>

              {order.timeline && order.timeline.length > 0 && (
                <div className="order-timeline">
                  <h4>Order Timeline</h4>
                  {order.timeline.map((event, index) => (
                    <div key={index} className="timeline-event">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-status">
                          {event.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                        <div className="timeline-time">
                          {new Date(event.timestamp).toLocaleString()}
                        </div>
                        {event.note && (
                          <div className="timeline-note">{event.note}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {order.deliveryMethod !== 'pickup' && order.tracking?.trackingNumber && (
                <div className="tracking-info">
                  <h4>Tracking Information</h4>
                  <div className="tracking-details">
                    <span>Tracking Number: <strong>{order.tracking.trackingNumber}</strong></span>
                    {order.tracking.trackingUrl && (
                      <a href={order.tracking.trackingUrl} target="_blank" rel="noopener noreferrer">
                        Track Package
                      </a>
                    )}
                  </div>
                </div>
              )}

              <div className="order-actions">
                {order.status === 'pending' && (
                  <>
                    <button 
                      className="action-btn primary"
                      onClick={() => updateOrderStatus(order._id, 'confirmed')}
                    >
                      Confirm Order
                    </button>
                    <button 
                      className="action-btn danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          updateOrderStatus(order._id, 'cancelled');
                        }
                      }}
                    >
                      Cancel Order
                    </button>
                  </>
                )}
                
                {order.status === 'confirmed' && (
                  <button 
                    className="action-btn primary"
                    onClick={() => updateOrderStatus(order._id, 'preparing')}
                  >
                    Start Preparing
                  </button>
                )}
                
                {order.status === 'preparing' && (
                  <>
                    {order.deliveryMethod === 'pickup' ? (
                      <button 
                        className="action-btn primary"
                        onClick={() => updateOrderStatus(order._id, 'ready-for-pickup')}
                      >
                        Ready for Pickup
                      </button>
                    ) : (
                      <button 
                        className="action-btn primary"
                        onClick={() => {
                          const trackingInfo = prompt('Enter tracking number (optional):');
                          updateOrderStatus(order._id, 'out-for-delivery', 
                            trackingInfo ? { trackingNumber: trackingInfo } : null);
                        }}
                      >
                        Out for Delivery
                      </button>
                    )}
                  </>
                )}
                
                {(order.status === 'ready-for-pickup' || order.status === 'out-for-delivery') && (
                  <button 
                    className="action-btn primary"
                    onClick={() => updateOrderStatus(order._id, 'delivered')}
                  >
                    Mark as Delivered
                  </button>
                )}

                <button 
                  className="action-btn secondary"
                  onClick={() => window.open(`mailto:${order.customer.email}?subject=Order ${order.orderNumber || order._id.slice(-8)}`)}
                >
                  Contact Customer
                </button>
              </div>
            </OrderCard>
          ))
        )}
      </SectionContent>
    </Section>
  );

  const renderProductsOverview = () => (
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
                  {product.images?.length > 0 ? 
                    <img 
                      src={getImageUrl((product.images.find(img => img.isFeatured) || product.images[0]).url)} 
                      alt={product.name} 
                      style={{width: '100%', height: '100%', objectFit: 'cover', borderRadius: '0.5rem'}} 
                    /> :
                    '📷'
                  }
                </div>
                <div className="product-info">
                  <h4>{product.name}</h4>
                  <p className="description">{product.description}</p>
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
                  {product.isOrganic && (
                    <div style={{
                      fontSize: '0.75rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      marginTop: '0.25rem',
                      background: product.organicCertificate?.status === 'approved' ? 'var(--primary-green)' :
                                 product.organicCertificate?.status === 'pending' ? '#f59e0b' :
                                 product.organicCertificate?.status === 'rejected' ? '#ef4444' : '#6b7280',
                      color: 'white',
                      fontWeight: '600',
                      textAlign: 'center'
                    }}>
                      🌱 Organic: {
                        product.organicCertificate?.status === 'approved' ? 'Certified' :
                        product.organicCertificate?.status === 'pending' ? 'Under Review' :
                        product.organicCertificate?.status === 'rejected' ? 'Rejected' : 'Awaiting Certificate'
                      }
                    </div>
                  )}
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
    </>
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

          {productForm.isOrganic && (
            <FormGroup className="full-width">
              <label>Organic Certification Document</label>
              <div style={{
                border: '2px dashed var(--border-light)',
                borderRadius: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                background: 'var(--natural-beige)',
                marginBottom: '0.5rem'
              }}>
                {productForm.organicCertificate ? (
                  <div>
                    <div style={{color: 'var(--primary-green)', marginBottom: '0.5rem'}}>
                      ✅ Certificate uploaded: {productForm.organicCertificate.originalName}
                    </div>
                    <button
                      type="button"
                      onClick={() => setProductForm({...productForm, organicCertificate: null})}
                      style={{
                        background: '#ef4444',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      Remove Certificate
                    </button>
                  </div>
                ) : (
                  <div>
                    <div style={{fontSize: '2rem', marginBottom: '0.5rem'}}>📄</div>
                    <div style={{marginBottom: '0.5rem'}}>Upload your organic certification document</div>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleCertificateUpload}
                      style={{display: 'none'}}
                      id="certificate-upload"
                    />
                    <button
                      type="button"
                      onClick={() => document.getElementById('certificate-upload').click()}
                      style={{
                        background: 'var(--primary-green)',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '0.25rem',
                        cursor: 'pointer'
                      }}
                    >
                      Choose File
                    </button>
                  </div>
                )}
              </div>
              <div style={{fontSize: '0.75rem', color: 'var(--text-light)'}}>
                Upload a PDF or image of your organic certification. This will be reviewed by our team before your product is marked as certified organic.
              </div>
            </FormGroup>
          )}

          <FormGroup className="full-width">
            <h4 style={{color: 'var(--text-dark)', marginBottom: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.5rem'}}>
              📦 Fulfillment Options
            </h4>
          </FormGroup>

          <FormGroup className="full-width">
            <label>How will customers receive this product?</label>
            <select
              name="fulfillment.method"
              value={productForm.fulfillment.method}
              onChange={handleFormChange}
              style={{width: '100%'}}
            >
              <option value="pickup-only">Pickup Only</option>
              <option value="delivery-only">Delivery Only</option>
              <option value="both">Both Pickup & Delivery</option>
            </select>
            <div className="help-text">
              Choose how customers can receive their orders
            </div>
          </FormGroup>

          {(productForm.fulfillment.method === 'pickup-only' || productForm.fulfillment.method === 'both') && (
            <FormGroup className="full-width">
              <label>Pickup Instructions (Optional)</label>
              <textarea
                name="fulfillment.pickupInstructions"
                value={productForm.fulfillment.pickupInstructions}
                onChange={handleFormChange}
                rows="3"
                placeholder="e.g., Available for pickup at our farm stand on weekends from 9am-5pm, or by appointment during the week."
              />
              <div className="help-text">
                Provide details about pickup location, hours, or special instructions
              </div>
            </FormGroup>
          )}

          {(productForm.fulfillment.method === 'delivery-only' || productForm.fulfillment.method === 'both') && (
            <>
              <FormGroup>
                <label>Delivery Radius (miles)</label>
                <input
                  type="number"
                  name="fulfillment.deliveryOptions.deliveryRadius"
                  value={productForm.fulfillment.deliveryOptions.deliveryRadius}
                  onChange={handleFormChange}
                  min="1"
                  max="50"
                  placeholder="5"
                />
                <div className="help-text">
                  Maximum distance you'll deliver from your location
                </div>
              </FormGroup>

              <FormGroup>
                <label>Delivery Fee ($)</label>
                <input
                  type="number"
                  name="fulfillment.deliveryOptions.deliveryFee"
                  value={productForm.fulfillment.deliveryOptions.deliveryFee}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  placeholder="5.00"
                />
              </FormGroup>

              <FormGroup>
                <label>Free Delivery Minimum ($)</label>
                <input
                  type="number"
                  name="fulfillment.deliveryOptions.freeDeliveryMinimum"
                  value={productForm.fulfillment.deliveryOptions.freeDeliveryMinimum}
                  onChange={handleFormChange}
                  min="0"
                  step="0.01"
                  placeholder="25.00"
                />
                <div className="help-text">
                  Orders over this amount get free delivery
                </div>
              </FormGroup>

              <FormGroup>
                <label>Estimated Delivery Time</label>
                <select
                  name="fulfillment.deliveryOptions.estimatedTime"
                  value={productForm.fulfillment.deliveryOptions.estimatedTime}
                  onChange={handleFormChange}
                  style={{width: '100%'}}
                >
                  <option value="1-2 hours">1-2 hours</option>
                  <option value="same-day">Same day</option>
                  <option value="next-day">Next day</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="weekly">Weekly delivery</option>
                </select>
              </FormGroup>
            </>
          )}

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
        <div className="profile-section">
          <div className="business-avatar">
            {user?.businessInfo?.businessPhoto?.url ? (
              <img src={getImageUrl(user.businessInfo.businessPhoto.url)} alt="Business" />
            ) : (
              user?.businessInfo?.businessName?.[0] || user?.name?.[0] || '?'
            )}
          </div>
          <div className="welcome-text">
            <h1>👋 Welcome, {user?.businessInfo?.businessName || user?.name}!</h1>
            <p>Manage your products, track sales, and grow your local business.</p>
          </div>
        </div>
      </Welcome>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
          >
            📦 Products & Overview
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

        {(activeTab === 'products' || activeTab === 'overview') && renderProductsOverview()}
        {activeTab === 'add-product' && renderAddProduct()}
        {activeTab === 'orders' && renderOrdersPage()}
      </TabContainer>

      <ShippingCommitmentModal
        isOpen={shippingModalOpen}
        onClose={() => setShippingModalOpen(false)}
        onConfirm={handleShippingCommitment}
        currentShippingOption={productForm.fulfillment?.method || 'pickup-only'}
      />
    </Container>
  );
};

export default MerchantDashboard;