import styled, { css } from 'styled-components';

// Mobile-first responsive utilities
export const mobileBreakpoints = {
  xs: '320px',
  sm: '480px', 
  md: '768px',
  lg: '1024px',
  xl: '1200px'
};

export const mobile = (styles) => css`
  @media (max-width: ${mobileBreakpoints.md}) {
    ${styles}
  }
`;

export const tablet = (styles) => css`
  @media (min-width: ${mobileBreakpoints.md}) and (max-width: ${mobileBreakpoints.lg}) {
    ${styles}
  }
`;

export const desktop = (styles) => css`
  @media (min-width: ${mobileBreakpoints.lg}) {
    ${styles}
  }
`;

// Mobile-optimized container
export const MobileContainer = styled.div`
  padding: 1rem;
  
  ${mobile(css`
    padding: 0.75rem;
  `)}
  
  ${desktop(css`
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  `)}
`;

// Mobile-friendly button
export const MobileButton = styled.button`
  padding: 0.875rem 1.5rem;
  min-height: 44px; // iOS minimum touch target
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  ${mobile(css`
    width: 100%;
    padding: 1rem;
    font-size: 1.125rem;
  `)}
  
  &.primary {
    background: var(--primary-green);
    color: white;
    
    &:hover {
      background: var(--primary-green-dark);
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
  
  &.secondary {
    background: white;
    color: var(--primary-green);
    border: 2px solid var(--primary-green);
    
    &:hover {
      background: var(--primary-green);
      color: white;
    }
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }
`;

// Mobile-optimized grid
export const MobileGrid = styled.div`
  display: grid;
  gap: 1rem;
  
  ${mobile(css`
    grid-template-columns: 1fr;
    gap: 0.75rem;
  `)}
  
  ${tablet(css`
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  `)}
  
  ${desktop(css`
    grid-template-columns: repeat(${props => props.$columns || 3}, 1fr);
    gap: 1.5rem;
  `)}
`;

// Mobile navigation
export const MobileNav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid var(--border-light);
  position: sticky;
  top: 0;
  z-index: 100;
  
  ${mobile(css`
    padding: 0.75rem 1rem;
  `)}
  
  .nav-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--primary-green);
    text-decoration: none;
    
    ${mobile(css`
      font-size: 1.25rem;
    `)}
  }
  
  .nav-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    ${mobile(css`
      gap: 0.5rem;
    `)}
  }
  
  .nav-toggle {
    display: none;
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    
    ${mobile(css`
      display: block;
    `)}
  }
`;

// Mobile-friendly form
export const MobileForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  ${mobile(css`
    gap: 0.75rem;
  `)}
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    
    label {
      font-weight: 600;
      color: var(--text-dark);
      font-size: 0.875rem;
    }
    
    input, textarea, select {
      padding: 0.875rem;
      border: 2px solid var(--border-light);
      border-radius: 0.5rem;
      font-size: 1rem;
      transition: border-color 0.2s;
      
      ${mobile(css`
        padding: 1rem;
        font-size: 1.125rem; // Prevents zoom on iOS
      `)}
      
      &:focus {
        outline: none;
        border-color: var(--primary-green);
      }
      
      &::placeholder {
        color: var(--text-light);
      }
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
  }
  
  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    
    ${mobile(css`
      grid-template-columns: 1fr;
      gap: 0.75rem;
    `)}
  }
`;

// Mobile card component
export const MobileCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  
  ${mobile(css`
    padding: 1rem;
    border-radius: 0.75rem;
  `)}
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    ${mobile(css`
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    `)}
    
    h3 {
      margin: 0;
      color: var(--text-dark);
      font-size: 1.25rem;
      
      ${mobile(css`
        font-size: 1.125rem;
      `)}
    }
  }
  
  .card-content {
    color: var(--text-dark);
    line-height: 1.6;
  }
  
  .card-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    
    ${mobile(css`
      flex-direction: column;
      gap: 0.75rem;
    `)}
  }
`;

// Mobile table wrapper
export const MobileTableWrapper = styled.div`
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  ${mobile(css`
    margin: 0 -1rem;
    padding: 0 1rem;
  `)}
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    ${mobile(css`
      min-width: 600px; // Ensures table doesn't get too cramped
    `)}
    
    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--border-light);
      
      ${mobile(css`
        padding: 0.5rem;
        font-size: 0.875rem;
      `)}
    }
    
    th {
      background: var(--natural-beige);
      font-weight: 600;
      color: var(--text-dark);
    }
  }
`;

// Mobile modal
export const MobileModal = styled.div`
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
  
  ${mobile(css`
    align-items: flex-start;
    padding: 0;
  `)}
  
  .modal-content {
    background: white;
    border-radius: 1rem;
    padding: 2rem;
    max-width: 500px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    
    ${mobile(css`
      border-radius: 1rem 1rem 0 0;
      margin-top: auto;
      max-height: 90vh;
      padding: 1.5rem;
    `)}
  }
  
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    
    h3 {
      margin: 0;
      color: var(--text-dark);
    }
    
    .close-button {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-light);
      
      &:hover {
        color: var(--text-dark);
      }
    }
  }
`;

// Touch-friendly spacing
export const TouchFriendly = styled.div`
  ${mobile(css`
    /* Ensure adequate spacing between touch targets */
    > * + * {
      margin-top: 0.75rem;
    }
    
    /* Larger touch targets for buttons and links */
    button, a {
      min-height: 44px;
      min-width: 44px;
    }
  `)}
`;

export default {
  MobileContainer,
  MobileButton,
  MobileGrid,
  MobileNav,
  MobileForm,
  MobileCard,
  MobileTableWrapper,
  MobileModal,
  TouchFriendly,
  mobile,
  tablet,
  desktop
};