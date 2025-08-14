import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const ForgotPasswordContainer = styled.div`
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background: var(--natural-beige);
`;

const ForgotPasswordCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 3rem;
  box-shadow: var(--shadow);
  width: 100%;
  max-width: 400px;

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
    line-height: 1.5;
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

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  text-align: center;

  &.success {
    background: #d1fae5;
    color: #065f46;
    border: 1px solid #a7f3d0;
  }

  &.error {
    background: #fee2e2;
    color: #dc2626;
    border: 1px solid #fecaca;
  }
`;

const BackLink = styled.div`
  text-align: center;
  margin-top: 2rem;

  a {
    color: var(--primary-green);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // TODO: Implement actual forgot password API call
      // For now, just show a success message
      setTimeout(() => {
        setMessage('If an account with that email exists, we\'ve sent you a password reset link.');
        setMessageType('success');
        setLoading(false);
      }, 1000);
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      setMessageType('error');
      setLoading(false);
    }
  };

  return (
    <ForgotPasswordContainer>
      <ForgotPasswordCard>
        <h1>Reset Password</h1>
        <div className="subtitle">
          Enter your email address and we'll send you a link to reset your password.
        </div>

        {message && (
          <Message className={messageType}>
            {message}
          </Message>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </SubmitButton>
        </Form>

        <BackLink>
          <Link to="/login">Back to Sign In</Link>
        </BackLink>
      </ForgotPasswordCard>
    </ForgotPasswordContainer>
  );
};

export default ForgotPassword;