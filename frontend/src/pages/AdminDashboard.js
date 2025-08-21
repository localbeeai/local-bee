import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';
import UserDetailModal from '../components/admin/UserDetailModal';
import ProductDetailModal from '../components/admin/ProductDetailModal';
import AdminFilters from '../components/admin/AdminFilters';
import Pagination from '../components/admin/Pagination';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const Header = styled.div`
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
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid var(--border-light);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  @media (max-width: 768px) {
    gap: 0.25rem;
    padding-bottom: 0.5rem;
  }
`;

const TabButton = styled.button`
  padding: 1rem 2rem;
  border: none;
  background: none;
  color: ${props => props.$active ? 'var(--primary-green)' : 'var(--text-light)'};
  border-bottom: 2px solid ${props => props.$active ? 'var(--primary-green)' : 'transparent'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;

  &:hover {
    color: var(--primary-green);
  }
  
  @media (max-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
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
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  
  .stat-icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--primary-green);
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: var(--text-light);
    font-size: 0.875rem;
  }
  
  &.alert {
    border-left: 4px solid #ef4444;
    
    .stat-number {
      color: #ef4444;
    }
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
  
  h2 {
    color: var(--text-dark);
    margin: 0;
  }
`;

const Table = styled.div`
  overflow-x: auto;
`;

const TableRow = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$columns || '1fr 1fr 1fr 1fr'};
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border-light);
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
  
  &.header {
    background: var(--natural-beige);
    font-weight: 600;
    color: var(--text-dark);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &.approve {
    background: var(--primary-green);
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.reject {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &.delete {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 3rem;
  color: var(--text-light);
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
  transform: scale(1.2);
  cursor: pointer;
`;

const ClickableRow = styled(TableRow)`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background: var(--natural-beige);
  }
  
  &.header {
    cursor: default;
    
    &:hover {
      background: var(--natural-beige);
    }
  }
`;

const ViewButton = styled.button`
  background: var(--primary-green);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background: #059669;
  }
`;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState({});
  
  // Modal states
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  
  // Filter states
  const [userFilters, setUserFilters] = useState({ search: '', role: '', status: '' });
  const [productFilters, setProductFilters] = useState({ search: '', category: '', status: '', isOrganic: '' });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  
  // Pagination states
  const [userPagination, setUserPagination] = useState({ currentPage: 1, totalPages: 1, totalUsers: 0 });
  const [productPagination, setProductPagination] = useState({ currentPage: 1, totalPages: 1, totalProducts: 0 });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchAdminData();
    }
  }, [user]);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, pendingRes] = await Promise.all([
        axios.get('/api/admin/stats'),
        axios.get('/api/admin/pending')
      ]);

      setStats(statsRes.data.stats);
      setPendingApprovals(pendingRes.data);
      
      // Fetch users and products with current filters
      await Promise.all([
        fetchUsers(),
        fetchProducts()
      ]);
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...userFilters
      });
      
      const response = await axios.get(`/api/admin/users?${params}`);
      setUsers(response.data.users);
      setUserPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchProducts = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...productFilters
      });
      
      const response = await axios.get(`/api/admin/products?${params}`);
      setProducts(response.data.products);
      setProductPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleApproveMerchant = async (userId, approved, reason = '') => {
    try {
      await axios.put(`/api/admin/users/${userId}/approve`, { approved, reason });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating merchant approval:', error);
      alert('Failed to update merchant approval');
    }
  };

  const handleApproveOrganic = async (productId, status, reason = '') => {
    try {
      await axios.put(`/api/admin/products/${productId}/organic-certificate`, { status, reason });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error updating organic certificate:', error);
      alert('Failed to update organic certificate');
    }
  };

  const handleApproveProduct = async (productId, approved, reason = '') => {
    try {
      await axios.put(`/api/admin/products/${productId}/approve`, { 
        approved, 
        reason 
      });
      fetchAdminData();
    } catch (error) {
      console.error('Error approving product:', error);
      alert('Failed to update product approval status');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    
    try {
      if (currentStatus) {
        await axios.delete(`/api/admin/users/${userId}`);
      } else {
        await axios.put(`/api/admin/users/${userId}/reactivate`);
      }
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      alert(`Failed to ${action} user`);
    }
  };

  const handleToggleProductStatus = async (productId, currentStatus) => {
    const action = currentStatus ? 'deactivate' : 'reactivate';
    if (!window.confirm(`Are you sure you want to ${action} this product?`)) return;
    
    try {
      await axios.put(`/api/admin/products/${productId}/toggle-status`, { 
        isActive: !currentStatus 
      });
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error(`Error ${action}ing product:`, error);
      alert(`Failed to ${action} product`);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to permanently delete this product?')) return;
    
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      fetchAdminData(); // Refresh data
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product');
    }
  };

  // Modal handlers
  const openUserModal = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setUserModalOpen(false);
  };

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setProductModalOpen(false);
  };

  // Filter handlers
  const handleUserFiltersChange = (newFilters) => {
    setUserFilters(newFilters);
    fetchUsers(1);
  };

  const handleProductFiltersChange = (newFilters) => {
    setProductFilters(newFilters);
    fetchProducts(1);
  };

  // Selection handlers
  const handleSelectUser = (userId, selected) => {
    if (selected) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  const handleSelectAllUsers = (selected) => {
    if (selected) {
      setSelectedUsers(users.map(user => user._id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelectProduct = (productId, selected) => {
    if (selected) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };

  const handleSelectAllProducts = (selected) => {
    if (selected) {
      setSelectedProducts(products.map(product => product._id));
    } else {
      setSelectedProducts([]);
    }
  };

  // Bulk action handlers
  const handleBulkUserAction = async (action, userIds) => {
    try {
      const promises = userIds.map(userId => {
        switch (action) {
          case 'approve':
            return axios.put(`/api/admin/users/${userId}/approve`, { approved: true });
          case 'deactivate':
            return axios.delete(`/api/admin/users/${userId}`);
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      setSelectedUsers([]);
      fetchAdminData();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Some actions failed. Please try again.');
    }
  };

  const handleBulkProductAction = async (action, productIds) => {
    try {
      const promises = productIds.map(productId => {
        switch (action) {
          case 'activate':
            return axios.put(`/api/admin/products/${productId}/toggle-status`, { isActive: true });
          case 'deactivate':
            return axios.put(`/api/admin/products/${productId}/toggle-status`, { isActive: false });
          default:
            return Promise.resolve();
        }
      });
      
      await Promise.all(promises);
      setSelectedProducts([]);
      fetchAdminData();
    } catch (error) {
      console.error('Bulk action error:', error);
      alert('Some actions failed. Please try again.');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Access Denied</h2>
          <p>You don't have permission to access this page.</p>
        </div>
      </Container>
    );
  }

  const renderOverview = () => (
    <div>
      <StatsGrid>
        <StatCard>
          <div className="stat-icon">👥</div>
          <div className="stat-number">{stats.totalUsers || 0}</div>
          <div className="stat-label">Total Users</div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">🏪</div>
          <div className="stat-number">{stats.totalMerchants || 0}</div>
          <div className="stat-label">Merchants</div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">🛍️</div>
          <div className="stat-number">{stats.totalCustomers || 0}</div>
          <div className="stat-label">Customers</div>
        </StatCard>
        <StatCard>
          <div className="stat-icon">📦</div>
          <div className="stat-number">{stats.totalProducts || 0}</div>
          <div className="stat-label">Products</div>
        </StatCard>
        <StatCard className={stats.pendingMerchants > 0 ? 'alert' : ''}>
          <div className="stat-icon">⏳</div>
          <div className="stat-number">{stats.pendingMerchants || 0}</div>
          <div className="stat-label">Pending Merchants</div>
        </StatCard>
        <StatCard className={stats.pendingOrganic > 0 ? 'alert' : ''}>
          <div className="stat-icon">🌱</div>
          <div className="stat-number">{stats.pendingOrganic || 0}</div>
          <div className="stat-label">Pending Organic Reviews</div>
        </StatCard>
        <StatCard className={stats.pendingProducts > 0 ? 'alert' : ''}>
          <div className="stat-icon">📋</div>
          <div className="stat-number">{stats.pendingProducts || 0}</div>
          <div className="stat-label">Pending Product Approvals</div>
        </StatCard>
      </StatsGrid>

      {(pendingApprovals.pendingMerchants?.length > 0 || pendingApprovals.pendingOrganic?.length > 0 || pendingApprovals.pendingProducts?.length > 0) && (
        <Section>
          <SectionHeader>
            <h2>⚠️ Pending Approvals</h2>
          </SectionHeader>
          
          {pendingApprovals.pendingMerchants?.length > 0 && (
            <div style={{ padding: '1.5rem' }}>
              <h3>Merchant Approvals</h3>
              <Table>
                <TableRow className="header" columns="2fr 1fr 1fr 2fr">
                  <div>Business</div>
                  <div>Owner</div>
                  <div>Applied</div>
                  <div>Actions</div>
                </TableRow>
                {pendingApprovals.pendingMerchants.map(merchant => (
                  <TableRow key={merchant._id} columns="2fr 1fr 1fr 2fr">
                    <div>
                      <strong>{merchant.businessInfo?.businessName}</strong>
                      <br />
                      <small style={{ color: 'var(--text-light)' }}>
                        {merchant.businessInfo?.businessDescription}
                      </small>
                    </div>
                    <div>{merchant.name}</div>
                    <div>{new Date(merchant.createdAt).toLocaleDateString()}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        className="approve" 
                        onClick={() => handleApproveMerchant(merchant._id, true)}
                      >
                        Approve
                      </Button>
                      <Button 
                        className="reject" 
                        onClick={() => handleApproveMerchant(merchant._id, false)}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}

          {pendingApprovals.pendingOrganic?.length > 0 && (
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <h3>Organic Certificate Reviews</h3>
              <Table>
                <TableRow className="header" columns="2fr 1fr 1fr 1fr 2fr">
                  <div>Product</div>
                  <div>Merchant</div>
                  <div>Submitted</div>
                  <div>Certificate</div>
                  <div>Actions</div>
                </TableRow>
                {pendingApprovals.pendingOrganic.map(product => (
                  <TableRow key={product._id} columns="2fr 1fr 1fr 1fr 2fr">
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small style={{ color: 'var(--text-light)' }}>
                        ${product.price} per {product.inventory?.unit}
                      </small>
                    </div>
                    <div>{product.merchant?.businessInfo?.businessName || product.merchant?.name}</div>
                    <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                    <div>
                      {product.organicCertificate?.url ? (
                        <Button 
                          className="approve"
                          onClick={() => window.open(getImageUrl(product.organicCertificate.url), '_blank')}
                          style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                        >
                          View Document
                        </Button>
                      ) : (
                        <span style={{ color: 'var(--text-light)', fontSize: '0.875rem' }}>No document</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        className="approve" 
                        onClick={() => handleApproveOrganic(product._id, 'approved')}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Approve
                      </Button>
                      <Button 
                        className="reject" 
                        onClick={() => handleApproveOrganic(product._id, 'rejected')}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}

          {pendingApprovals.pendingProducts?.length > 0 && (
            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <h3>Product Approvals</h3>
              <Table>
                <TableRow className="header" columns="2fr 1fr 1fr 2fr">
                  <div>Product</div>
                  <div>Merchant</div>
                  <div>Submitted</div>
                  <div>Actions</div>
                </TableRow>
                {pendingApprovals.pendingProducts.map(product => (
                  <TableRow key={product._id} columns="2fr 1fr 1fr 2fr">
                    <div>
                      <strong>{product.name}</strong>
                      <br />
                      <small style={{ color: 'var(--text-light)' }}>
                        ${product.price} • {product.category}
                      </small>
                    </div>
                    <div>{product.merchant?.businessInfo?.businessName || product.merchant?.name}</div>
                    <div>{new Date(product.createdAt).toLocaleDateString()}</div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button 
                        className="approve" 
                        onClick={() => handleApproveProduct(product._id, true)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Approve
                      </Button>
                      <Button 
                        className="reject" 
                        onClick={() => handleApproveProduct(product._id, false)}
                        style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem' }}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableRow>
                ))}
              </Table>
            </div>
          )}
        </Section>
      )}
    </div>
  );

  const renderUsers = () => (
    <div>
      <AdminFilters
        type="users"
        filters={userFilters}
        onFiltersChange={handleUserFiltersChange}
        totalCount={userPagination.totalUsers}
        selectedItems={selectedUsers}
        onBulkAction={handleBulkUserAction}
        loading={loading}
      />
      
      <Section>
        <SectionHeader>
          <h2>User Management</h2>
        </SectionHeader>
        <Table>
          <ClickableRow className="header" $columns="auto 2fr 1fr 1fr 1fr 2fr">
            <div>
              <Checkbox
                type="checkbox"
                checked={selectedUsers.length === users.length && users.length > 0}
                onChange={(e) => handleSelectAllUsers(e.target.checked)}
              />
            </div>
            <div>User</div>
            <div>Role</div>
            <div>Status</div>
            <div>Joined</div>
            <div>Actions</div>
          </ClickableRow>
          {users.map(user => (
            <ClickableRow key={user._id} $columns="auto 2fr 1fr 1fr 1fr 2fr">
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  type="checkbox"
                  checked={selectedUsers.includes(user._id)}
                  onChange={(e) => handleSelectUser(user._id, e.target.checked)}
                />
              </div>
              <div onClick={() => openUserModal(user)}>
                <strong>{user.role === 'merchant' ? user.businessInfo?.businessName : user.name}</strong>
                <br />
                <small style={{ color: 'var(--text-light)' }}>{user.email}</small>
              </div>
              <div style={{ 
                textTransform: 'capitalize',
                color: user.role === 'admin' ? 'var(--primary-green)' : 'var(--text-dark)'
              }}>
                {user.role}
              </div>
              <div>
                {user.isActive === false ? (
                  <span style={{ color: '#ef4444' }}>❌ Deactivated</span>
                ) : user.role === 'merchant' ? (
                  user.businessInfo?.isApproved ? 
                    <span style={{ color: 'var(--primary-green)' }}>✅ Approved</span> : 
                    <span style={{ color: '#f59e0b' }}>⏳ Pending Approval</span>
                ) : (
                  <span style={{ color: 'var(--primary-green)' }}>✅ Active</span>
                )}
              </div>
              <div>{new Date(user.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                <ViewButton onClick={() => openUserModal(user)}>
                  👁️ View Details
                </ViewButton>
              </div>
            </ClickableRow>
          ))}
        </Table>
        
        <Pagination
          currentPage={userPagination.currentPage}
          totalPages={userPagination.totalPages}
          totalItems={userPagination.totalUsers}
          onPageChange={fetchUsers}
        />
      </Section>
    </div>
  );

  const renderProducts = () => (
    <div>
      <AdminFilters
        type="products"
        filters={productFilters}
        onFiltersChange={handleProductFiltersChange}
        totalCount={productPagination.totalProducts}
        selectedItems={selectedProducts}
        onBulkAction={handleBulkProductAction}
        loading={loading}
      />
      
      <Section>
        <SectionHeader>
          <h2>Product Management</h2>
        </SectionHeader>
        <Table>
          <ClickableRow className="header" $columns="auto 2fr 1fr 1fr 1fr 2fr">
            <div>
              <Checkbox
                type="checkbox"
                checked={selectedProducts.length === products.length && products.length > 0}
                onChange={(e) => handleSelectAllProducts(e.target.checked)}
              />
            </div>
            <div>Product</div>
            <div>Merchant</div>
            <div>Price</div>
            <div>Status</div>
            <div>Actions</div>
          </ClickableRow>
          {products.map(product => (
            <ClickableRow key={product._id} $columns="auto 2fr 1fr 1fr 1fr 2fr">
              <div onClick={(e) => e.stopPropagation()}>
                <Checkbox
                  type="checkbox"
                  checked={selectedProducts.includes(product._id)}
                  onChange={(e) => handleSelectProduct(product._id, e.target.checked)}
                />
              </div>
              <div onClick={() => openProductModal(product)}>
                <strong>{product.name}</strong>
                <br />
                <small style={{ color: 'var(--text-light)' }}>
                  {product.category} • {product.isOrganic ? '🌱 Organic' : ''} • {product.views || 0} views
                </small>
              </div>
              <div>{product.merchant?.businessInfo?.businessName || product.merchant?.name}</div>
              <div>${product.price}</div>
              <div>
                <div style={{ fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Status: <span style={{ 
                    color: (product.approvalStatus || 'pending') === 'approved' 
                      ? 'var(--primary-green)' 
                      : (product.approvalStatus || 'pending') === 'rejected'
                      ? '#ef4444'
                      : (product.approvalStatus || 'pending') === 'resubmitted'
                      ? '#3b82f6'
                      : '#f59e0b',
                    fontWeight: '600'
                  }}>
                    {(product.approvalStatus || 'pending') === 'approved' ? '✅ Live' :
                     (product.approvalStatus || 'pending') === 'rejected' ? '❌ Rejected' :
                     (product.approvalStatus || 'pending') === 'resubmitted' ? '🔄 Resubmitted' :
                     '⏳ Pending'}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>
                  Product: {product.isActive ? 'Active' : 'Inactive'}
                </div>
                {product.isOrganic && product.organicCertificate?.status === 'pending' && (
                  <div style={{ fontSize: '0.75rem', color: '#f59e0b', marginTop: '0.25rem' }}>
                    ⏳ Organic Review Pending
                  </div>
                )}
                {product.approvalStatus === 'rejected' && product.rejectionReason && (
                  <div style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '0.25rem', fontStyle: 'italic' }}>
                    Reason: {product.rejectionReason.substring(0, 50)}...
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }} onClick={(e) => e.stopPropagation()}>
                <ViewButton onClick={() => openProductModal(product)}>
                  👁️ View Details
                </ViewButton>
              </div>
            </ClickableRow>
          ))}
        </Table>
        
        <Pagination
          currentPage={productPagination.currentPage}
          totalPages={productPagination.totalPages}
          totalItems={productPagination.totalProducts}
          onPageChange={fetchProducts}
        />
      </Section>
    </div>
  );

  if (loading) {
    return (
      <Container>
        <LoadingState>Loading admin dashboard...</LoadingState>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <h1>🛡️ Admin Dashboard</h1>
        <p>Manage users, products, and platform operations</p>
      </Header>

      <TabContainer>
        <TabButtons>
          <TabButton 
            $active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </TabButton>
          <TabButton 
            $active={activeTab === 'users'} 
            onClick={() => setActiveTab('users')}
          >
            Users ({userPagination.totalUsers || 0})
          </TabButton>
          <TabButton 
            $active={activeTab === 'products'} 
            onClick={() => setActiveTab('products')}
          >
            Products ({productPagination.totalProducts || 0})
          </TabButton>
        </TabButtons>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'products' && renderProducts()}
      </TabContainer>

      {/* Modals */}
      <UserDetailModal
        user={selectedUser}
        isOpen={userModalOpen}
        onClose={closeUserModal}
        onApprove={handleApproveMerchant}
        onReject={handleApproveMerchant}
        onToggleStatus={handleToggleUserStatus}
      />

      <ProductDetailModal
        product={selectedProduct}
        isOpen={productModalOpen}
        onClose={closeProductModal}
        onToggleStatus={handleToggleProductStatus}
        onDelete={handleDeleteProduct}
        onApproveOrganic={handleApproveOrganic}
        onApproveProduct={handleApproveProduct}
      />
    </Container>
  );
};

export default AdminDashboard;