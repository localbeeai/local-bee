import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const SignupContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--natural-beige);
`;

const SignupCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 500px;

  h1 {
    text-align: center;
    color: var(--text-dark);
    margin-bottom: 1rem;
    font-size: 2rem;
  }

  .subtitle {
    text-align: center;
    color: var(--text-light);
    margin-bottom: 2rem;
  }
`;

const RoleSelector = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const RoleCard = styled.div`
  flex: 1;
  padding: 1.5rem;
  border: 2px solid ${props => props.selected ? 'var(--primary-green)' : 'var(--border-light)'};
  border-radius: 0.75rem;
  cursor: pointer;
  text-align: center;
  background: ${props => props.selected ? 'var(--secondary-green)' : 'white'};
  transition: all 0.2s;

  &:hover {
    border-color: var(--primary-green);
  }

  .icon {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }

  .title {
    font-weight: 600;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
  }

  .description {
    font-size: 0.875rem;
    color: var(--text-light);
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-dark);
    font-weight: 500;
  }

  input, textarea {
    width: 100%;
  }

  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorMessage = styled.div`
  background: #fee2e2;
  color: #dc2626;
  padding: 0.75rem;
  border-radius: 0.5rem;
  border: 1px solid #fecaca;
  font-size: 0.875rem;
`;

const SubmitButton = styled.button`
  background: var(--primary-green);
  color: white;
  border: none;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover:not(:disabled) {
    background: var(--primary-green-dark);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 2rem;
  color: var(--text-light);

  a {
    color: var(--primary-green);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    phone: '',
    businessName: '',
    businessDescription: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleRoleSelect = (role) => {
    setFormData({
      ...formData,
      role
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.role) {
      setError('Please select your account type');
      return;
    }

    if (formData.role === 'merchant' && (!formData.businessName || !formData.phone)) {
      setError('Business name and phone number are required for merchants');
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone,
        businessName: formData.businessName,
        businessDescription: formData.businessDescription,
        address: formData.address
      };

      const result = await signup(userData);
      
      if (result.success) {
        navigate('/welcome');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContainer>
      <SignupCard>
        <h1>🌱 Join LocalMarket</h1>
        <p className="subtitle">Create your account and start supporting local businesses</p>

        <RoleSelector>
          <RoleCard 
            selected={formData.role === 'customer'} 
            onClick={() => handleRoleSelect('customer')}
          >
            <div className="icon">🛒</div>
            <div className="title">Customer</div>
            <div className="description">Shop local products</div>
          </RoleCard>
          
          <RoleCard 
            selected={formData.role === 'merchant'} 
            onClick={() => handleRoleSelect('merchant')}
          >
            <div className="icon">🏪</div>
            <div className="title">Merchant</div>
            <div className="description">Sell your products</div>
          </RoleCard>
        </RoleSelector>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </FormGroup>

          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
            />
          </FormGroup>

          <FormRow>
            <FormGroup>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create password"
                minLength="6"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm password"
              />
            </FormGroup>
          </FormRow>

          {formData.role === 'merchant' && (
            <>
              <FormGroup>
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  required
                  placeholder="Your business name"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="(555) 123-4567"
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="businessDescription">Business Description (Optional)</label>
                <textarea
                  id="businessDescription"
                  name="businessDescription"
                  value={formData.businessDescription}
                  onChange={handleChange}
                  placeholder="Tell customers about your business..."
                />
              </FormGroup>
            </>
          )}

          <FormRow>
            <FormGroup>
              <label htmlFor="address.city">City</label>
              <input
                type="text"
                id="address.city"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                placeholder="Your city"
              />
            </FormGroup>

            <FormGroup>
              <label htmlFor="address.zipCode">ZIP Code</label>
              <input
                type="text"
                id="address.zipCode"
                name="address.zipCode"
                value={formData.address.zipCode}
                onChange={handleChange}
                placeholder="12345"
              />
            </FormGroup>
          </FormRow>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginLink>
          Already have an account? <Link to="/login">Sign in here</Link>
        </LoginLink>
      </SignupCard>
    </SignupContainer>
  );
};

export default Signup;