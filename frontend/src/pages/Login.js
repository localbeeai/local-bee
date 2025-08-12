import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const LoginContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--natural-beige);
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;

  h1 {
    text-align: center;
    color: var(--text-dark);
    margin-bottom: 2rem;
    font-size: 2rem;
  }

  .subtitle {
    text-align: center;
    color: var(--text-light);
    margin-bottom: 2rem;
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

  input {
    width: 100%;
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

const SignupLink = styled.div`
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        navigate(from, { replace: true });
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
    <LoginContainer>
      <LoginCard>
        <h1>🌱 Welcome Back</h1>
        <p className="subtitle">Sign in to your LocalMarket account</p>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Form onSubmit={handleSubmit}>
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

          <FormGroup>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <SignupLink>
          Don't have an account? <Link to="/signup">Sign up here</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;