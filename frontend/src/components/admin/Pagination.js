import React from 'react';
import styled from 'styled-components';

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-light);
  background: ${props => props.$active ? 'var(--primary-green)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--text-dark)'};
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover:not(:disabled) {
    background: ${props => props.$active ? 'var(--primary-green)' : 'var(--natural-beige)'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Info = styled.span`
  color: var(--text-light);
  font-size: 0.875rem;
  margin: 0 1rem;
`;

const Pagination = ({ 
  currentPage, 
  totalPages, 
  totalItems, 
  onPageChange,
  itemsPerPage = 20
}) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <PaginationContainer>
      <Button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </Button>
      
      {getPageNumbers().map((page, index) => (
        page === '...' ? (
          <span key={index} style={{ padding: '0.5rem', color: 'var(--text-light)' }}>
            ...
          </span>
        ) : (
          <Button
            key={index}
            $active={page === currentPage}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        )
      ))}
      
      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
      
      <Info>
        Showing {startItem}-{endItem} of {totalItems} items
      </Info>
    </PaginationContainer>
  );
};

export default Pagination;