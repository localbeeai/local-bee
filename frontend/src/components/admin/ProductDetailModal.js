import React, { useState } from 'react';
import styled from 'styled-components';
import { getImageUrl } from '../../utils/imageUrl';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  max-width: 900px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  padding: 2rem;
  border-bottom: 1px solid var(--border-light);
  display: flex;
  justify-content: between;
  align-items: center;
  
  h2 {
    margin: 0;
    color: var(--text-dark);
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--text-light);
  margin-left: auto;
  
  &:hover {
    color: var(--text-dark);
  }
`;

const Content = styled.div`
  padding: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;
  
  h3 {
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-size: 1.125rem;
    border-bottom: 2px solid var(--primary-green);
    padding-bottom: 0.5rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const InfoItem = styled.div`
  .label {
    font-weight: 600;
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
  }
  
  .value {
    color: var(--text-dark);
    font-size: 1rem;
  }
`;

const StatusBadge = styled.span`
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  
  &.active {
    background: #dcfce7;
    color: #166534;
  }
  
  &.inactive {
    background: #fee2e2;
    color: #991b1b;
  }
  
  &.pending {
    background: #fef3c7;
    color: #92400e;
  }
  
  &.approved {
    background: #dcfce7;
    color: #166534;
  }
  
  &.rejected {
    background: #fee2e2;
    color: #991b1b;
  }
`;

const ImageGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  
  img {
    width: 100%;
    height: 120px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
    cursor: pointer;
    transition: transform 0.2s;
    
    &:hover {
      transform: scale(1.05);
    }
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const Tag = styled.span`
  background: var(--natural-beige);
  color: var(--text-dark);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
`;

const ActionSection = styled.div`
  border-top: 1px solid var(--border-light);
  padding: 1.5rem 2rem;
  background: var(--natural-beige);
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: var(--primary-green);
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.danger {
    background: #ef4444;
    color: white;
    
    &:hover {
      background: #dc2626;
    }
  }
  
  &.secondary {
    background: var(--border-light);
    color: var(--text-dark);
    
    &:hover {
      background: #e5e5e5;
    }
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  resize: vertical;
  min-height: 100px;
`;

const OrganicCertContainer = styled.div`
  border: 2px dashed var(--border-light);
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  
  &.pending {
    border-color: #f59e0b;
    background: #fefbf2;
  }
  
  &.approved {
    border-color: var(--primary-green);
    background: #f0fdf4;
  }
  
  &.rejected {
    border-color: #ef4444;
    background: #fef2f2;
  }
`;

const ProductDetailModal = ({ 
  product, 
  isOpen, 
  onClose, 
  onToggleStatus, 
  onDelete, 
  onApproveOrganic,
  onApproveProduct
}) => {
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [actionType, setActionType] = useState('');

  if (!isOpen || !product) return null;

  const handleAction = async (action, status = null) => {
    if (action === 'organic-approve' || action === 'organic-reject') {
      if (action === 'organic-reject' && !reason.trim()) {
        setActionType(action);
        setShowReasonInput(true);
        return;
      }
      
      await onApproveOrganic(
        product._id, 
        action === 'organic-approve' ? 'approved' : 'rejected',
        reason
      );
    } else if (action === 'product-approve' || action === 'product-reject') {
      if (action === 'product-reject' && !reason.trim()) {
        setActionType(action);
        setShowReasonInput(true);
        return;
      }
      
      await onApproveProduct(
        product._id,
        action === 'product-approve',
        reason
      );
    } else if (action === 'toggle') {
      await onToggleStatus(product._id, product.isActive);
    } else if (action === 'delete') {
      if (window.confirm('Are you sure you want to permanently delete this product?')) {
        await onDelete(product._id);
      }
    }
    
    setReason('');
    setShowReasonInput(false);
    setActionType('');
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getStockStatus = () => {
    const quantity = product.inventory?.quantity || 0;
    const threshold = product.inventory?.lowStockThreshold || 5;
    
    if (quantity === 0) return { status: 'out', text: 'Out of Stock' };
    if (quantity <= threshold) return { status: 'low', text: 'Low Stock' };
    return { status: 'good', text: 'In Stock' };
  };

  const stockStatus = getStockStatus();

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <h2>
            📦 {product.name}
          </h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        
        <Content>
          {/* Basic Product Information */}
          <Section>
            <h3>Product Details</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Name</div>
                <div className="value">{product.name}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Price</div>
                <div className="value">{formatPrice(product.price)}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Category</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>
                  {product.category}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Subcategory</div>
                <div className="value">{product.subcategory}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Status</div>
                <div className="value">
                  <StatusBadge className={product.isActive ? 'active' : 'inactive'}>
                    {product.isActive ? 'Active' : 'Inactive'}
                  </StatusBadge>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Approval Status</div>
                <div className="value">
                  <StatusBadge className={product.approvalStatus || 'pending'}>
                    {(product.approvalStatus || 'pending').charAt(0).toUpperCase() + 
                     (product.approvalStatus || 'pending').slice(1)}
                  </StatusBadge>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Created</div>
                <div className="value">{new Date(product.createdAt).toLocaleDateString()}</div>
              </InfoItem>
            </InfoGrid>
            
            {product.description && (
              <InfoItem style={{ marginTop: '1rem' }}>
                <div className="label">Description</div>
                <div className="value">{product.description}</div>
              </InfoItem>
            )}

            {product.tags && product.tags.length > 0 && (
              <InfoItem style={{ marginTop: '1rem' }}>
                <div className="label">Tags</div>
                <TagContainer>
                  {product.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </TagContainer>
              </InfoItem>
            )}
          </Section>

          {/* Merchant Information */}
          <Section>
            <h3>Merchant</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Business Name</div>
                <div className="value">
                  {product.merchant?.businessInfo?.businessName || product.merchant?.name}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Merchant Email</div>
                <div className="value">{product.merchant?.email}</div>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Inventory Information */}
          <Section>
            <h3>Inventory & Fulfillment</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Quantity</div>
                <div className="value">
                  {product.inventory?.quantity || 0} {product.inventory?.unit}
                  <StatusBadge 
                    className={stockStatus.status === 'good' ? 'active' : stockStatus.status === 'low' ? 'pending' : 'inactive'}
                    style={{ marginLeft: '0.5rem' }}
                  >
                    {stockStatus.text}
                  </StatusBadge>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Low Stock Threshold</div>
                <div className="value">{product.inventory?.lowStockThreshold || 0}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Fulfillment Method</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>
                  {product.fulfillment?.method?.replace('-', ' ') || 'Not specified'}
                </div>
              </InfoItem>
              {product.fulfillment?.deliveryOptions?.deliveryFee !== undefined && (
                <InfoItem>
                  <div className="label">Delivery Fee</div>
                  <div className="value">{formatPrice(product.fulfillment.deliveryOptions.deliveryFee)}</div>
                </InfoItem>
              )}
            </InfoGrid>
          </Section>

          {/* Product Features */}
          <Section>
            <h3>Product Features</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Organic</div>
                <div className="value">
                  {product.isOrganic ? (
                    <span style={{ color: 'var(--primary-green)' }}>🌱 Yes</span>
                  ) : (
                    <span>❌ No</span>
                  )}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Locally Sourced</div>
                <div className="value">
                  {product.isLocallySourced ? (
                    <span style={{ color: 'var(--primary-green)' }}>🏡 Yes</span>
                  ) : (
                    <span>❌ No</span>
                  )}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Featured</div>
                <div className="value">
                  {product.featured ? (
                    <span style={{ color: 'var(--primary-green)' }}>⭐ Yes</span>
                  ) : (
                    <span>❌ No</span>
                  )}
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Views</div>
                <div className="value">{product.views || 0}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Rating</div>
                <div className="value">
                  {product.rating?.average ? (
                    `⭐ ${product.rating.average.toFixed(1)} (${product.rating.count} reviews)`
                  ) : (
                    'No reviews yet'
                  )}
                </div>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Organic Certificate Section */}
          {product.isOrganic && (
            <Section>
              <h3>Organic Certification</h3>
              {product.organicCertificate ? (
                <OrganicCertContainer className={product.organicCertificate.status}>
                  <InfoGrid>
                    <InfoItem>
                      <div className="label">Status</div>
                      <div className="value">
                        <StatusBadge className={product.organicCertificate.status}>
                          {product.organicCertificate.status?.charAt(0).toUpperCase() + 
                           product.organicCertificate.status?.slice(1)}
                        </StatusBadge>
                      </div>
                    </InfoItem>
                    {product.organicCertificate.reviewedAt && (
                      <InfoItem>
                        <div className="label">Reviewed Date</div>
                        <div className="value">
                          {new Date(product.organicCertificate.reviewedAt).toLocaleDateString()}
                        </div>
                      </InfoItem>
                    )}
                  </InfoGrid>
                  
                  {product.organicCertificate.url && (
                    <div style={{ marginTop: '1rem' }}>
                      <Button 
                        className="primary"
                        onClick={() => window.open(getImageUrl(product.organicCertificate.url), '_blank')}
                      >
                        📄 View Certificate Document
                      </Button>
                    </div>
                  )}
                  
                  {product.organicCertificate.reason && (
                    <InfoItem style={{ marginTop: '1rem' }}>
                      <div className="label">Review Notes</div>
                      <div className="value" style={{ 
                        color: product.organicCertificate.status === 'approved' 
                          ? 'var(--primary-green)' 
                          : '#ef4444',
                        fontStyle: 'italic'
                      }}>
                        {product.organicCertificate.reason}
                      </div>
                    </InfoItem>
                  )}
                </OrganicCertContainer>
              ) : (
                <OrganicCertContainer>
                  <p>No organic certificate submitted</p>
                </OrganicCertContainer>
              )}
            </Section>
          )}

          {/* Product Images */}
          {product.images && product.images.length > 0 && (
            <Section>
              <h3>Product Images</h3>
              <ImageGallery>
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={getImageUrl(image.url)}
                    alt={image.alt || `Product image ${index + 1}`}
                    onClick={() => window.open(getImageUrl(image.url), '_blank')}
                  />
                ))}
              </ImageGallery>
            </Section>
          )}

          {/* Action Reason Input */}
          {showReasonInput && (
            <Section>
              <h3>
                {(actionType === 'organic-reject' || actionType === 'product-reject') ? 'Rejection Reason' : 'Review Notes'} 
                {(actionType === 'organic-reject' || actionType === 'product-reject') && <span style={{ color: '#ef4444' }}> *</span>}
              </h3>
              <TextArea
                placeholder={
                  actionType === 'organic-reject' 
                    ? 'Please provide a reason for rejecting the organic certificate...' 
                    : actionType === 'product-reject'
                    ? 'Please provide a reason for rejecting this product...'
                    : 'Optional review notes...'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Section>
          )}
        </Content>

        <ActionSection>
          {/* Product Approval Actions */}
          {(product.approvalStatus || 'pending') === 'pending' && (
            <>
              <Button 
                className="primary" 
                onClick={() => handleAction('product-approve')}
              >
                ✅ Approve Product
              </Button>
              <Button 
                className="danger" 
                onClick={() => handleAction('product-reject')}
              >
                ❌ Reject Product
              </Button>
            </>
          )}

          {/* Organic Certificate Approval Actions */}
          {product.isOrganic && product.organicCertificate?.status === 'pending' && (
            <>
              <Button 
                className="primary" 
                onClick={() => handleAction('organic-approve')}
              >
                ✅ Approve Certificate
              </Button>
              <Button 
                className="danger" 
                onClick={() => handleAction('organic-reject')}
              >
                ❌ Reject Certificate
              </Button>
            </>
          )}
          
          {showReasonInput && (
            <Button 
              className="primary" 
              onClick={() => handleAction(actionType)}
              disabled={(actionType === 'organic-reject' || actionType === 'product-reject') && !reason.trim()}
            >
              Confirm {(actionType === 'organic-reject' || actionType === 'product-reject') ? 'Rejection' : 'Action'}
            </Button>
          )}
          
          <Button 
            className={product.isActive ? 'danger' : 'primary'} 
            onClick={() => handleAction('toggle')}
          >
            {product.isActive ? '❌ Deactivate' : '✅ Activate'} Product
          </Button>
          
          <Button 
            className="danger" 
            onClick={() => handleAction('delete')}
          >
            🗑️ Delete Product
          </Button>
          
          <Button className="secondary" onClick={onClose}>
            Close
          </Button>
        </ActionSection>
      </Modal>
    </Overlay>
  );
};

export default ProductDetailModal;