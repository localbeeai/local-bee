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
  max-width: 800px;
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

const BusinessPhotoContainer = styled.div`
  img {
    max-width: 200px;
    max-height: 150px;
    object-fit: cover;
    border-radius: 0.5rem;
    box-shadow: var(--shadow);
  }
`;

const UserDetailModal = ({ user, isOpen, onClose, onApprove, onReject, onToggleStatus }) => {
  const [reason, setReason] = useState('');
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [actionType, setActionType] = useState('');

  if (!isOpen || !user) return null;

  const handleAction = async (action, approved = null) => {
    if (action === 'approve' || action === 'reject') {
      if (action === 'reject' && !reason.trim()) {
        setActionType(action);
        setShowReasonInput(true);
        return;
      }
      
      if (action === 'approve') {
        await onApprove(user._id, true, reason);
      } else {
        await onApprove(user._id, false, reason);
      }
    } else if (action === 'toggle') {
      await onToggleStatus(user._id, user.isActive !== false);
    }
    
    setReason('');
    setShowReasonInput(false);
    setActionType('');
    onClose();
  };

  const getStatusInfo = () => {
    if (user.isActive === false) {
      return { status: 'inactive', text: 'Deactivated' };
    }
    
    if (user.role === 'merchant') {
      if (user.businessInfo?.isApproved) {
        return { status: 'approved', text: 'Approved Merchant' };
      } else {
        return { status: 'pending', text: 'Pending Approval' };
      }
    }
    
    return { status: 'active', text: 'Active' };
  };

  const statusInfo = getStatusInfo();

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <h2>
            {user.role === 'merchant' ? '🏪' : user.role === 'admin' ? '👑' : '👤'} 
            {user.role === 'merchant' ? user.businessInfo?.businessName : user.name}
          </h2>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        
        <Content>
          {/* Basic Information */}
          <Section>
            <h3>Basic Information</h3>
            <InfoGrid>
              <InfoItem>
                <div className="label">Name</div>
                <div className="value">{user.name}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Email</div>
                <div className="value">{user.email}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Phone</div>
                <div className="value">{user.phone || 'Not provided'}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Role</div>
                <div className="value" style={{ textTransform: 'capitalize' }}>{user.role}</div>
              </InfoItem>
              <InfoItem>
                <div className="label">Status</div>
                <div className="value">
                  <StatusBadge className={statusInfo.status}>
                    {statusInfo.text}
                  </StatusBadge>
                </div>
              </InfoItem>
              <InfoItem>
                <div className="label">Joined</div>
                <div className="value">{new Date(user.createdAt).toLocaleDateString()}</div>
              </InfoItem>
            </InfoGrid>
          </Section>

          {/* Address Information */}
          {user.address && (
            <Section>
              <h3>Address</h3>
              <InfoGrid>
                <InfoItem>
                  <div className="label">Street</div>
                  <div className="value">{user.address.street || 'Not provided'}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">City</div>
                  <div className="value">{user.address.city || 'Not provided'}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">State</div>
                  <div className="value">{user.address.state || 'Not provided'}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">ZIP Code</div>
                  <div className="value">{user.address.zipCode || 'Not provided'}</div>
                </InfoItem>
              </InfoGrid>
            </Section>
          )}

          {/* Business Information (for merchants) */}
          {user.role === 'merchant' && user.businessInfo && (
            <Section>
              <h3>Business Information</h3>
              <InfoGrid>
                <InfoItem>
                  <div className="label">Business Name</div>
                  <div className="value">{user.businessInfo.businessName}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Business Type</div>
                  <div className="value">{user.businessInfo.businessType || 'Not specified'}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Website</div>
                  <div className="value">
                    {user.businessInfo.website ? (
                      <a href={user.businessInfo.website} target="_blank" rel="noopener noreferrer">
                        {user.businessInfo.website}
                      </a>
                    ) : 'Not provided'}
                  </div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Tax ID</div>
                  <div className="value">{user.businessInfo.taxId || 'Not provided'}</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Delivery Radius</div>
                  <div className="value">{user.businessInfo.deliveryRadius || 0} miles</div>
                </InfoItem>
                <InfoItem>
                  <div className="label">Services</div>
                  <div className="value">
                    {[
                      user.businessInfo.offersPickup && 'Pickup',
                      user.businessInfo.offersDelivery && 'Delivery',
                      user.businessInfo.sameDayDelivery && 'Same-day Delivery'
                    ].filter(Boolean).join(', ') || 'None specified'}
                  </div>
                </InfoItem>
              </InfoGrid>
              
              {user.businessInfo.businessDescription && (
                <InfoItem style={{ marginTop: '1rem' }}>
                  <div className="label">Business Description</div>
                  <div className="value">{user.businessInfo.businessDescription}</div>
                </InfoItem>
              )}

              {user.businessInfo.businessPhoto?.url && (
                <InfoItem style={{ marginTop: '1rem' }}>
                  <div className="label">Business Photo</div>
                  <BusinessPhotoContainer>
                    <img 
                      src={getImageUrl(user.businessInfo.businessPhoto.url)} 
                      alt="Business"
                    />
                  </BusinessPhotoContainer>
                </InfoItem>
              )}

              {user.businessInfo.approvalReason && (
                <InfoItem style={{ marginTop: '1rem' }}>
                  <div className="label">
                    {user.businessInfo.isApproved ? 'Approval Notes' : 'Rejection Reason'}
                  </div>
                  <div className="value" style={{ 
                    color: user.businessInfo.isApproved ? 'var(--primary-green)' : '#ef4444',
                    fontStyle: 'italic'
                  }}>
                    {user.businessInfo.approvalReason}
                  </div>
                </InfoItem>
              )}
            </Section>
          )}

          {/* Action Reason Input */}
          {showReasonInput && (
            <Section>
              <h3>
                {actionType === 'reject' ? 'Rejection Reason' : 'Notes'} 
                {actionType === 'reject' && <span style={{ color: '#ef4444' }}> *</span>}
              </h3>
              <TextArea
                placeholder={
                  actionType === 'reject' 
                    ? 'Please provide a reason for rejection...' 
                    : 'Optional notes...'
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Section>
          )}
        </Content>

        <ActionSection>
          {user.role === 'merchant' && !user.businessInfo?.isApproved && user.isActive !== false && (
            <>
              <Button 
                className="primary" 
                onClick={() => handleAction('approve')}
              >
                ✅ Approve Merchant
              </Button>
              <Button 
                className="danger" 
                onClick={() => handleAction('reject')}
              >
                ❌ Reject Application
              </Button>
            </>
          )}
          
          {showReasonInput && (
            <Button 
              className="primary" 
              onClick={() => handleAction(actionType)}
              disabled={actionType === 'reject' && !reason.trim()}
            >
              Confirm {actionType === 'reject' ? 'Rejection' : 'Action'}
            </Button>
          )}
          
          {user.role !== 'admin' && (
            <Button 
              className={user.isActive === false ? 'primary' : 'danger'} 
              onClick={() => handleAction('toggle')}
            >
              {user.isActive === false ? '🔓 Reactivate' : '🔒 Deactivate'} User
            </Button>
          )}
          
          <Button className="secondary" onClick={onClose}>
            Close
          </Button>
        </ActionSection>
      </Modal>
    </Overlay>
  );
};

export default UserDetailModal;