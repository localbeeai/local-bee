import React from 'react';
import styled from 'styled-components';
import Messages from '../components/Messages';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  min-height: calc(100vh - 200px);
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;

  h1 {
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 2rem;
  }

  p {
    color: var(--text-light);
    font-size: 1.1rem;
  }
`;

const MessagesWrapper = styled.div`
  background: white;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  overflow: hidden;
`;

const MessagesPage = () => {
  return (
    <Container>
      <PageHeader>
        <h1>💬 Messages</h1>
        <p>Communicate with customers and merchants about your orders and products.</p>
      </PageHeader>

      <MessagesWrapper>
        <Messages />
      </MessagesWrapper>
    </Container>
  );
};

export default MessagesPage;