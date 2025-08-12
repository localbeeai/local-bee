import React from 'react';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

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

const CustomerDashboard = () => {
  const { user } = useAuth();

  return (
    <Container>
      <Welcome>
        <h1>👋 Welcome back, {user?.name}!</h1>
        <p>Your dashboard is being prepared. Soon you'll be able to view your orders, track deliveries, and manage your account.</p>
      </Welcome>
    </Container>
  );
};

export default CustomerDashboard;