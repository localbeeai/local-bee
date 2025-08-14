import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from '../config/api';
import { getImageUrl } from '../utils/imageUrl';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
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
  color: ${props => props.active ? 'var(--primary-green)' : 'var(--text-light)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary-green)' : 'transparent'};
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
  
  @media (max-width: 480px) {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
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
    font-size: 1.25rem;
  }
  
  p {
    color: var(--text-light);
    margin: 0.5rem 0 0 0;
    font-size: 0.875rem;
  }
`;

const SectionContent = styled.div`
  padding: 1.5rem;
`;

const Form = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
    font-size: 0.875rem;
  }

  input, textarea, select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-light);
    border-radius: 0.5rem;
    font-size: 1rem;
    
    &:focus {
      border-color: var(--primary-green);
      outline: none;
      box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
    }
  }
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
  
  .help-text {
    font-size: 0.75rem;
    color: var(--text-light);
    margin-top: 0.25rem;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    width: auto;
  }
  
  label {
    margin: 0;
    font-weight: normal;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
`;

const PhotoUpload = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  
  .photo-preview {
    width: 100px;
    height: 100px;
    border-radius: 0.75rem;
    overflow: hidden;
    background: var(--natural-beige);
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid var(--border-light);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .placeholder {
      font-size: 2rem;
      color: var(--text-light);
    }
  }
  
  .upload-controls {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    input[type="file"] {
      display: none;
    }
    
    .upload-btn {
      padding: 0.5rem 1rem;
      background: var(--primary-green);
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      
      &:hover {
        background: var(--primary-green-dark);
      }
    }
    
    .remove-btn {
      padding: 0.5rem 1rem;
      background: #ef4444;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      
      &:hover {
        background: #dc2626;
      }
    }
    
    .help-text {
      font-size: 0.75rem;
      color: var(--text-light);
    }
  }
`;

const SuccessMessage = styled.div`
  background: var(--secondary-green);
  color: var(--primary-green);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 500;
`;

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  });

  const [businessData, setBusinessData] = useState({
    businessName: '',
    businessType: '',
    businessDescription: '',
    businessLicense: '',
    taxId: '',
    website: '',
    businessPhoto: null
  });

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: {
          street: user.address?.street || '',
          city: user.address?.city || '',
          state: user.address?.state || '',
          zipCode: user.address?.zipCode || '',
          country: user.address?.country || 'United States'
        }
      });

      if (user.role === 'merchant' && user.businessInfo) {
        setBusinessData({
          businessName: user.businessInfo.businessName || '',
          businessType: user.businessInfo.businessType || '',
          businessDescription: user.businessInfo.businessDescription || '',
          businessLicense: user.businessInfo.businessLicense || '',
          taxId: user.businessInfo.taxId || '',
          website: user.businessInfo.website || '',
          businessPhoto: user.businessInfo.businessPhoto || null
        });
      }
    }
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setProfileData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleBusinessChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBusinessData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await axios.put('/api/users/profile', profileData);
      updateUser(response.data);
      setMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const updateData = {
        ...profileData,
        businessInfo: businessData
      };
      
      const response = await axios.put('/api/users/profile', updateData);
      updateUser(response.data);
      setMessage('Business information updated successfully!');
    } catch (error) {
      console.error('Error updating business info:', error);
      setError(error.response?.data?.message || 'Failed to update business information');
    } finally {
      setLoading(false);
    }
  };

  const handleBusinessPhotoUpload = async (file) => {
    try {
      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setError('File too large. Maximum size is 5MB.');
        return;
      }

      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG, and WebP formats are allowed.');
        return;
      }

      const formData = new FormData();
      formData.append('businessPhoto', file);

      const response = await axios.post('/api/upload/business-photo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setBusinessData(prev => ({
        ...prev,
        businessPhoto: response.data.image
      }));

      setMessage('Business photo uploaded successfully!');
      setError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error uploading business photo:', error);
      setError(error.response?.data?.message || 'Failed to upload business photo');
    }
  };

  const handleBusinessPhotoRemove = async () => {
    try {
      if (businessData.businessPhoto?.filename) {
        await axios.delete(`/api/upload/image/${businessData.businessPhoto.filename}`);
      }

      setBusinessData(prev => ({
        ...prev,
        businessPhoto: null
      }));

      setMessage('Business photo removed successfully!');
    } catch (error) {
      console.error('Error removing business photo:', error);
      setError('Failed to remove business photo');
    }
  };

  const renderProfileTab = () => (
    <Section>
      <SectionHeader>
        <h2>Personal Information</h2>
        <p>Update your personal details and contact information</p>
      </SectionHeader>
      <SectionContent>
        {message && <SuccessMessage>{message}</SuccessMessage>}
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleProfileSubmit}>
          <FormGroup>
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleProfileChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Email Address</label>
            <input
              type="email"
              name="email"
              value={profileData.email}
              onChange={handleProfileChange}
              required
            />
          </FormGroup>

          <FormGroup>
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={profileData.phone}
              onChange={handleProfileChange}
              placeholder="(555) 123-4567"
            />
          </FormGroup>

          <FormGroup>
            <label>Street Address</label>
            <input
              type="text"
              name="address.street"
              value={profileData.address.street}
              onChange={handleProfileChange}
              placeholder="123 Main Street"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label>City</label>
              <input
                type="text"
                name="address.city"
                value={profileData.address.city}
                onChange={handleProfileChange}
                placeholder="Your City"
              />
            </FormGroup>

            <FormGroup>
              <label>State</label>
              <input
                type="text"
                name="address.state"
                value={profileData.address.state}
                onChange={handleProfileChange}
                placeholder="State"
              />
            </FormGroup>
          </FormRow>

          <FormRow>
            <FormGroup>
              <label>ZIP Code</label>
              <input
                type="text"
                name="address.zipCode"
                value={profileData.address.zipCode}
                onChange={handleProfileChange}
                placeholder="12345"
              />
            </FormGroup>

            <FormGroup>
              <label>Country</label>
              <select
                name="address.country"
                value={profileData.address.country}
                onChange={handleProfileChange}
              >
                <option value="United States">United States</option>
                <option value="Canada">Canada</option>
              </select>
            </FormGroup>
          </FormRow>

          <ButtonGroup>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </ButtonGroup>
        </Form>
      </SectionContent>
    </Section>
  );

  const renderBusinessTab = () => (
    <>
      <Section>
        <SectionHeader>
          <h2>Business Information</h2>
          <p>Manage your business details and storefront information</p>
        </SectionHeader>
        <SectionContent>
          {message && <SuccessMessage>{message}</SuccessMessage>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          
          <Form onSubmit={handleBusinessSubmit}>
            <FormGroup>
              <label>Business Name</label>
              <input
                type="text"
                name="businessName"
                value={businessData.businessName}
                onChange={handleBusinessChange}
                required
                placeholder="Your Business Name"
              />
            </FormGroup>

            <FormGroup>
              <label>Business Profile Photo</label>
              <PhotoUpload>
                <div className="photo-preview">
                  {businessData.businessPhoto ? (
                    <img 
                      src={getImageUrl(businessData.businessPhoto.url)} 
                      alt="Business Profile" 
                    />
                  ) : (
                    <div className="placeholder">🏢</div>
                  )}
                </div>
                <div className="upload-controls">
                  <input
                    type="file"
                    id="businessPhoto"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleBusinessPhotoUpload(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="upload-btn"
                    onClick={() => document.getElementById('businessPhoto').click()}
                  >
                    {businessData.businessPhoto ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {businessData.businessPhoto && (
                    <button
                      type="button"
                      className="remove-btn"
                      onClick={handleBusinessPhotoRemove}
                    >
                      Remove Photo
                    </button>
                  )}
                  <div className="help-text">
                    JPEG, PNG, or WebP. Max 5MB.
                  </div>
                </div>
              </PhotoUpload>
            </FormGroup>

            <FormGroup>
              <label>Business Type</label>
              <select
                name="businessType"
                value={businessData.businessType}
                onChange={handleBusinessChange}
                required
              >
                <option value="">Select Business Type</option>
                <option value="Farm">Farm</option>
                <option value="Market">Market</option>
                <option value="Bakery">Bakery</option>
                <option value="Restaurant">Restaurant</option>
                <option value="Grocery Store">Grocery Store</option>
                <option value="Specialty Food">Specialty Food</option>
                <option value="Craft Business">Craft Business</option>
                <option value="Other">Other</option>
              </select>
            </FormGroup>

            <FormGroup>
              <label>Business Description</label>
              <textarea
                name="businessDescription"
                value={businessData.businessDescription}
                onChange={handleBusinessChange}
                placeholder="Tell customers about your business, products, and what makes you special..."
                rows="4"
              />
              <div className="help-text">
                This will be displayed on your merchant profile page
              </div>
            </FormGroup>

            <FormRow>
              <FormGroup>
                <label>Business License Number</label>
                <input
                  type="text"
                  name="businessLicense"
                  value={businessData.businessLicense}
                  onChange={handleBusinessChange}
                  placeholder="Optional"
                />
              </FormGroup>

              <FormGroup>
                <label>Tax ID (EIN)</label>
                <input
                  type="text"
                  name="taxId"
                  value={businessData.taxId}
                  onChange={handleBusinessChange}
                  placeholder="Optional"
                />
              </FormGroup>
            </FormRow>

            <FormGroup>
              <label>Website</label>
              <input
                type="url"
                name="website"
                value={businessData.website}
                onChange={handleBusinessChange}
                placeholder="https://yourbusiness.com"
              />
            </FormGroup>

            <ButtonGroup>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Business Info'}
              </button>
            </ButtonGroup>
          </Form>
        </SectionContent>
      </Section>

    </>
  );

  const renderSecurityTab = () => (
    <Section>
      <SectionHeader>
        <h2>Security Settings</h2>
        <p>Manage your password and security preferences</p>
      </SectionHeader>
      <SectionContent>
        <Form>
          <FormGroup>
            <label>Change Password</label>
            <input type="password" placeholder="Current password" />
          </FormGroup>
          <FormGroup>
            <input type="password" placeholder="New password" />
          </FormGroup>
          <FormGroup>
            <input type="password" placeholder="Confirm new password" />
          </FormGroup>
          <ButtonGroup>
            <button type="button" className="btn-primary">
              Update Password
            </button>
          </ButtonGroup>
        </Form>

        <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />

        <Form>
          <FormGroup>
            <label>
              <input type="checkbox" /> Enable two-factor authentication
            </label>
            <small style={{ color: 'var(--text-light)', display: 'block', marginTop: '0.5rem' }}>
              Add an extra layer of security to your account
            </small>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" /> Email notifications for login attempts
            </label>
          </FormGroup>
        </Form>
      </SectionContent>
    </Section>
  );

  const renderNotificationsTab = () => (
    <Section>
      <SectionHeader>
        <h2>Notification Preferences</h2>
        <p>Choose how you want to be notified</p>
      </SectionHeader>
      <SectionContent>
        <Form>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Email Notifications</h3>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> New orders and purchases
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> Messages from buyers/sellers
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" /> Marketing and promotional emails
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> Account security updates
            </label>
          </FormGroup>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Push Notifications</h3>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> New messages
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> Order updates
            </label>
          </FormGroup>

          <ButtonGroup>
            <button type="button" className="btn-primary">
              Save Preferences
            </button>
          </ButtonGroup>
        </Form>
      </SectionContent>
    </Section>
  );

  const renderPaymentsTab = () => (
    <Section>
      <SectionHeader>
        <h2>Payment Methods</h2>
        <p>Manage your payment and billing information</p>
      </SectionHeader>
      <SectionContent>
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💳</div>
          <h3 style={{ marginBottom: '1rem' }}>Payment Integration Coming Soon</h3>
          <p>We're working on integrating secure payment processing. This will include:</p>
          <ul style={{ textAlign: 'left', margin: '1rem 0', paddingLeft: '2rem' }}>
            <li>Credit and debit card management</li>
            <li>PayPal integration</li>
            <li>Bank account linking</li>
            <li>Transaction history</li>
          </ul>
        </div>
      </SectionContent>
    </Section>
  );

  const renderPrivacyTab = () => (
    <Section>
      <SectionHeader>
        <h2>Privacy Settings</h2>
        <p>Control your privacy and data preferences</p>
      </SectionHeader>
      <SectionContent>
        <Form>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Profile Visibility</h3>
          <FormGroup>
            <label>
              <input type="radio" name="profileVisibility" defaultChecked /> Public - Anyone can see your profile
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="radio" name="profileVisibility" /> Limited - Only customers you've sold to
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="radio" name="profileVisibility" /> Private - Only you can see your profile
            </label>
          </FormGroup>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Data & Analytics</h3>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> Allow analytics for improving our service
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" /> Share anonymized data with partners
            </label>
          </FormGroup>

          <hr style={{ margin: '2rem 0', border: 'none', borderTop: '1px solid var(--border-light)' }} />

          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>Contact Preferences</h3>
          <FormGroup>
            <label>
              <input type="checkbox" defaultChecked /> Allow customers to contact me directly
            </label>
          </FormGroup>
          <FormGroup>
            <label>
              <input type="checkbox" /> Show my location to potential customers
            </label>
          </FormGroup>

          <ButtonGroup>
            <button type="button" className="btn-primary">
              Save Privacy Settings
            </button>
          </ButtonGroup>
        </Form>
      </SectionContent>
    </Section>
  );

  return (
    <Container>
      <Header>
        <h1>⚙️ Settings</h1>
        <p>Manage your account and business information</p>
      </Header>

      <TabContainer>
        <TabButtons>
          <TabButton 
            active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            Personal Info
          </TabButton>
          {user?.role === 'merchant' && (
            <TabButton 
              active={activeTab === 'business'} 
              onClick={() => setActiveTab('business')}
            >
              Business Info
            </TabButton>
          )}
          <TabButton 
            active={activeTab === 'security'} 
            onClick={() => setActiveTab('security')}
          >
            Security
          </TabButton>
          <TabButton 
            active={activeTab === 'notifications'} 
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </TabButton>
          <TabButton 
            active={activeTab === 'payments'} 
            onClick={() => setActiveTab('payments')}
          >
            Payments
          </TabButton>
          <TabButton 
            active={activeTab === 'privacy'} 
            onClick={() => setActiveTab('privacy')}
          >
            Privacy
          </TabButton>
        </TabButtons>

        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'business' && user?.role === 'merchant' && renderBusinessTab()}
        {activeTab === 'security' && renderSecurityTab()}
        {activeTab === 'notifications' && renderNotificationsTab()}
        {activeTab === 'payments' && renderPaymentsTab()}
        {activeTab === 'privacy' && renderPrivacyTab()}
      </TabContainer>
    </Container>
  );
};

export default Settings;