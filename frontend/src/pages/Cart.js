import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Cart = () => {
  return (
    <Container>
      <h2>Shopping Cart - Coming Soon</h2>
    </Container>
  );
};

export default Cart;