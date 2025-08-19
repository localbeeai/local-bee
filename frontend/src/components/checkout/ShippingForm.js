import React, { useState } from 'react';
import styled from 'styled-components';
import Select from 'react-select';

const ShippingContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.8rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 0.5rem;
  }
  
  p {
    color: #6B7280;
    margin: 0;
  }
`;

const FormSection = styled.div`
  background: #FAFAFA;
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    color: #1F2937;
    margin: 0 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  &.full-width {
    grid-template-columns: 1fr;
  }
  
  &.two-col {
    grid-template-columns: 1fr 1fr;
    
    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }
  }
`;

const FormField = styled.div`
  &.full-width {
    grid-column: 1 / -1;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
  
  .required {
    color: #EF4444;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &.error {
    border-color: #EF4444;
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid #E5E7EB;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: white;
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const CheckboxField = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1.5rem 0;
  
  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
  
  label {
    cursor: pointer;
    font-size: 0.95rem;
    color: #4B5563;
    margin: 0;
  }
`;

const DeliveryMethodSection = styled.div`
  margin-bottom: 2rem;
`;

const DeliveryOption = styled.label`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 2px solid ${props => props.selected ? '#3B82F6' : '#E5E7EB'};
  border-radius: 8px;
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};
  
  &:hover {
    border-color: ${props => props.selected ? '#3B82F6' : '#D1D5DB'};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const RadioInput = styled.input`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const DeliveryInfo = styled.div`
  flex: 1;
  
  .title {
    font-size: 1rem;
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 0.25rem;
  }
  
  .description {
    font-size: 0.9rem;
    color: #6B7280;
    margin-bottom: 0.25rem;
  }
  
  .time {
    font-size: 0.8rem;
    color: #059669;
    font-weight: 500;
  }
`;

const DeliveryPrice = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1F2937;
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #E5E7EB;
  
  @media (max-width: 640px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  flex: 1;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: #3B82F6;
  color: white;
  border: 2px solid #3B82F6;
  
  &:hover:not(:disabled) {
    background: #2563EB;
    border-color: #2563EB;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
`;

const SecondaryButton = styled(Button)`
  background: white;
  color: #4B5563;
  border: 2px solid #D1D5DB;
  
  &:hover:not(:disabled) {
    border-color: #9CA3AF;
    background: #F9FAFB;
  }
`;

const SavedAddresses = styled.div`
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  
  h4 {
    margin: 0 0 1rem;
    color: #1F2937;
    font-size: 1rem;
  }
`;

const AddressOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border: 1px solid ${props => props.selected ? '#3B82F6' : '#E5E7EB'};
  border-radius: 6px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.selected ? '#EFF6FF' : 'white'};
  
  &:hover {
    border-color: ${props => props.selected ? '#3B82F6' : '#D1D5DB'};
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const AddressDetails = styled.div`
  flex: 1;
  font-size: 0.9rem;
  color: #4B5563;
  
  .name {
    font-weight: 600;
    color: #1F2937;
    margin-bottom: 0.25rem;
  }
`;

// US States options
const stateOptions = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' }
];

const ShippingForm = ({ 
  shippingData, 
  setShippingData, 
  billingData, 
  setBillingData, 
  onNext, 
  onBack, 
  loading 
}) => {
  const [errors, setErrors] = useState({});
  const [selectedSavedAddress, setSelectedSavedAddress] = useState(null);

  // Mock saved addresses (would come from user profile)
  const savedAddresses = [
    {
      id: 'home',
      name: 'Home',
      firstName: 'John',
      lastName: 'Doe',
      address: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zipCode: '12345'
    }
  ];

  const deliveryOptions = [
    {
      id: 'pickup',
      title: '🏪 Store Pickup',
      description: 'Pick up from merchant locations',
      time: 'Ready in 2-4 hours',
      price: 0
    },
    {
      id: 'standard-delivery',
      title: '🚚 Standard Delivery',
      description: 'Delivery to your address',
      time: '2-5 business days',
      price: 5
    },
    {
      id: 'same-day-delivery',
      title: '⚡ Same Day Delivery',
      description: 'Express delivery service',
      time: 'Within 24 hours',
      price: 15
    }
  ];

  const handleInputChange = (field, value) => {
    setShippingData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleBillingChange = (field, value) => {
    setBillingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStateChange = (selectedOption) => {
    handleInputChange('state', selectedOption?.value || '');
  };

  const handleSavedAddressSelect = (address) => {
    setSelectedSavedAddress(address.id);
    setShippingData(prev => ({
      ...prev,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    const required = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    
    required.forEach(field => {
      if (!shippingData[field]?.trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
      }
    });

    // Email validation
    if (shippingData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (shippingData.phone && !/^\+?[\d\s\-\(\)]+$/.test(shippingData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    // Zip code validation
    if (shippingData.zipCode && !/^\d{5}(-\d{4})?$/.test(shippingData.zipCode)) {
      newErrors.zipCode = 'Please enter a valid ZIP code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onNext();
    }
  };

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      border: `2px solid ${state.isFocused ? '#3B82F6' : '#E5E7EB'}`,
      borderRadius: '8px',
      padding: '0.25rem 0.5rem',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        border: `2px solid ${state.isFocused ? '#3B82F6' : '#D1D5DB'}`
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#EFF6FF' : 'white',
      color: state.isSelected ? 'white' : '#1F2937'
    })
  };

  return (
    <ShippingContainer>
      <Header>
        <h2>Shipping & Billing Information</h2>
        <p>Secure and fast delivery to your preferred address</p>
      </Header>

      <form onSubmit={handleSubmit}>
        {savedAddresses.length > 0 && (
          <SavedAddresses>
            <h4>📍 Use a saved address</h4>
            {savedAddresses.map((address) => (
              <AddressOption
                key={address.id}
                selected={selectedSavedAddress === address.id}
                onClick={() => handleSavedAddressSelect(address)}
              >
                <RadioInput
                  type="radio"
                  name="savedAddress"
                  value={address.id}
                  checked={selectedSavedAddress === address.id}
                  readOnly
                />
                <AddressDetails>
                  <div className="name">{address.name}</div>
                  <div>
                    {address.firstName} {address.lastName}<br />
                    {address.address}<br />
                    {address.city}, {address.state} {address.zipCode}
                  </div>
                </AddressDetails>
              </AddressOption>
            ))}
          </SavedAddresses>
        )}

        <FormSection>
          <h3>📍 Shipping Address</h3>
          
          <FormGrid className="two-col">
            <FormField>
              <Label>
                First Name <span className="required">*</span>
              </Label>
              <Input
                type="text"
                value={shippingData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className={errors.firstName ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.firstName && (
                <ErrorMessage>⚠️ {errors.firstName}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label>
                Last Name <span className="required">*</span>
              </Label>
              <Input
                type="text"
                value={shippingData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className={errors.lastName ? 'error' : ''}
                placeholder="Enter your last name"
              />
              {errors.lastName && (
                <ErrorMessage>⚠️ {errors.lastName}</ErrorMessage>
              )}
            </FormField>
          </FormGrid>

          <FormGrid className="two-col">
            <FormField>
              <Label>
                Email Address <span className="required">*</span>
              </Label>
              <Input
                type="email"
                value={shippingData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'error' : ''}
                placeholder="your@email.com"
              />
              {errors.email && (
                <ErrorMessage>⚠️ {errors.email}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label>Phone Number</Label>
              <Input
                type="tel"
                value={shippingData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={errors.phone ? 'error' : ''}
                placeholder="(555) 123-4567"
              />
              {errors.phone && (
                <ErrorMessage>⚠️ {errors.phone}</ErrorMessage>
              )}
            </FormField>
          </FormGrid>

          <FormGrid className="full-width">
            <FormField className="full-width">
              <Label>
                Street Address <span className="required">*</span>
              </Label>
              <Input
                type="text"
                value={shippingData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className={errors.address ? 'error' : ''}
                placeholder="123 Main Street"
              />
              {errors.address && (
                <ErrorMessage>⚠️ {errors.address}</ErrorMessage>
              )}
            </FormField>
          </FormGrid>

          <FormGrid className="full-width">
            <FormField className="full-width">
              <Label>Apartment, Suite, etc. (Optional)</Label>
              <Input
                type="text"
                value={shippingData.apartment}
                onChange={(e) => handleInputChange('apartment', e.target.value)}
                placeholder="Apt 4B, Suite 100, etc."
              />
            </FormField>
          </FormGrid>

          <FormGrid>
            <FormField>
              <Label>
                City <span className="required">*</span>
              </Label>
              <Input
                type="text"
                value={shippingData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className={errors.city ? 'error' : ''}
                placeholder="Enter city"
              />
              {errors.city && (
                <ErrorMessage>⚠️ {errors.city}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label>
                State <span className="required">*</span>
              </Label>
              <Select
                options={stateOptions}
                value={stateOptions.find(option => option.value === shippingData.state)}
                onChange={handleStateChange}
                styles={customSelectStyles}
                placeholder="Select state"
                isSearchable
              />
              {errors.state && (
                <ErrorMessage>⚠️ {errors.state}</ErrorMessage>
              )}
            </FormField>

            <FormField>
              <Label>
                ZIP Code <span className="required">*</span>
              </Label>
              <Input
                type="text"
                value={shippingData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className={errors.zipCode ? 'error' : ''}
                placeholder="12345"
              />
              {errors.zipCode && (
                <ErrorMessage>⚠️ {errors.zipCode}</ErrorMessage>
              )}
            </FormField>
          </FormGrid>
        </FormSection>

        <DeliveryMethodSection>
          <FormSection>
            <h3>🚛 Delivery Method</h3>
            {deliveryOptions.map((option) => (
              <DeliveryOption
                key={option.id}
                selected={shippingData.deliveryMethod === option.id}
              >
                <RadioInput
                  type="radio"
                  name="deliveryMethod"
                  value={option.id}
                  checked={shippingData.deliveryMethod === option.id}
                  onChange={(e) => handleInputChange('deliveryMethod', e.target.value)}
                />
                <DeliveryInfo>
                  <div className="title">{option.title}</div>
                  <div className="description">{option.description}</div>
                  <div className="time">{option.time}</div>
                </DeliveryInfo>
                <DeliveryPrice>
                  {option.price === 0 ? 'FREE' : `$${option.price.toFixed(2)}`}
                </DeliveryPrice>
              </DeliveryOption>
            ))}

            <FormGrid className="full-width">
              <FormField className="full-width">
                <Label>Delivery Instructions (Optional)</Label>
                <TextArea
                  value={shippingData.deliveryInstructions}
                  onChange={(e) => handleInputChange('deliveryInstructions', e.target.value)}
                  placeholder="Special delivery instructions, gate codes, etc."
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </DeliveryMethodSection>

        <FormSection>
          <h3>💳 Billing Address</h3>
          
          <CheckboxField>
            <input
              type="checkbox"
              id="sameAsShipping"
              checked={billingData.sameAsShipping}
              onChange={(e) => handleBillingChange('sameAsShipping', e.target.checked)}
            />
            <label htmlFor="sameAsShipping">
              Billing address is the same as shipping address
            </label>
          </CheckboxField>

          {!billingData.sameAsShipping && (
            <>
              <FormGrid className="two-col">
                <FormField>
                  <Label>First Name <span className="required">*</span></Label>
                  <Input
                    type="text"
                    value={billingData.firstName}
                    onChange={(e) => handleBillingChange('firstName', e.target.value)}
                    placeholder="Enter first name"
                  />
                </FormField>

                <FormField>
                  <Label>Last Name <span className="required">*</span></Label>
                  <Input
                    type="text"
                    value={billingData.lastName}
                    onChange={(e) => handleBillingChange('lastName', e.target.value)}
                    placeholder="Enter last name"
                  />
                </FormField>
              </FormGrid>

              <FormGrid className="full-width">
                <FormField className="full-width">
                  <Label>Street Address <span className="required">*</span></Label>
                  <Input
                    type="text"
                    value={billingData.address}
                    onChange={(e) => handleBillingChange('address', e.target.value)}
                    placeholder="123 Main Street"
                  />
                </FormField>
              </FormGrid>

              <FormGrid>
                <FormField>
                  <Label>City <span className="required">*</span></Label>
                  <Input
                    type="text"
                    value={billingData.city}
                    onChange={(e) => handleBillingChange('city', e.target.value)}
                    placeholder="Enter city"
                  />
                </FormField>

                <FormField>
                  <Label>State <span className="required">*</span></Label>
                  <Select
                    options={stateOptions}
                    value={stateOptions.find(option => option.value === billingData.state)}
                    onChange={(selectedOption) => handleBillingChange('state', selectedOption?.value || '')}
                    styles={customSelectStyles}
                    placeholder="Select state"
                  />
                </FormField>

                <FormField>
                  <Label>ZIP Code <span className="required">*</span></Label>
                  <Input
                    type="text"
                    value={billingData.zipCode}
                    onChange={(e) => handleBillingChange('zipCode', e.target.value)}
                    placeholder="12345"
                  />
                </FormField>
              </FormGrid>
            </>
          )}
        </FormSection>

        <ActionButtons>
          <SecondaryButton 
            type="button"
            onClick={onBack}
            disabled={loading}
          >
            ← Back to Cart
          </SecondaryButton>
          
          <PrimaryButton 
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Processing...
              </>
            ) : (
              <>
                Continue to Payment →
              </>
            )}
          </PrimaryButton>
        </ActionButtons>
      </form>
    </ShippingContainer>
  );
};

export default ShippingForm;