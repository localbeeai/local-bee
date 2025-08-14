import React, { useState } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow);
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  
  h3 {
    margin: 0;
    color: var(--text-dark);
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  
  label {
    font-weight: 500;
    color: var(--text-dark);
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid var(--border-light);
  border-radius: 0.5rem;
  font-size: 1rem;
  background: white;
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
    box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const Button = styled.button`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &.primary {
    background: var(--primary-green);
    color: white;
    
    &:hover {
      background: #059669;
    }
  }
  
  &.secondary {
    background: var(--border-light);
    color: var(--text-dark);
    
    &:hover {
      background: #e5e5e5;
    }
  }
`;

const ResultsInfo = styled.div`
  background: var(--natural-beige);
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .count {
    font-weight: 600;
    color: var(--text-dark);
  }
  
  .actions {
    display: flex;
    gap: 0.5rem;
  }
`;

const AdminFilters = ({ 
  type, // 'users' or 'products'
  filters,
  onFiltersChange,
  totalCount,
  selectedItems = [],
  onBulkAction,
  loading = false
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const clearFilters = () => {
    const clearedFilters = type === 'users' 
      ? { search: '', role: '', status: '' }
      : { search: '', category: '', status: '', isOrganic: '' };
    
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const handleBulkAction = (action) => {
    if (selectedItems.length === 0) {
      alert('Please select items first');
      return;
    }
    
    if (window.confirm(`Are you sure you want to ${action} ${selectedItems.length} selected items?`)) {
      onBulkAction(action, selectedItems);
    }
  };

  return (
    <>
      <FilterContainer>
        <FilterHeader>
          <h3>🔍 Search & Filter</h3>
          <ButtonGroup>
            <Button className="primary" onClick={applyFilters} disabled={loading}>
              Apply Filters
            </Button>
            <Button className="secondary" onClick={clearFilters}>
              Clear All
            </Button>
          </ButtonGroup>
        </FilterHeader>
        
        <FilterGrid>
          <FilterGroup>
            <label>Search</label>
            <Input
              type="text"
              placeholder={type === 'users' ? 'Search by name, email, business...' : 'Search by name, description...'}
              value={localFilters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </FilterGroup>
          
          {type === 'users' && (
            <>
              <FilterGroup>
                <label>Role</label>
                <Select
                  value={localFilters.role || ''}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                >
                  <option value="">All Roles</option>
                  <option value="customer">Customer</option>
                  <option value="merchant">Merchant</option>
                  <option value="admin">Admin</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup>
                <label>Status</label>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending Approval</option>
                  <option value="approved">Approved</option>
                </Select>
              </FilterGroup>
            </>
          )}
          
          {type === 'products' && (
            <>
              <FilterGroup>
                <label>Category</label>
                <Select
                  value={localFilters.category || ''}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <option value="">All Categories</option>
                  <option value="produce">Produce</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="seafood">Seafood</option>
                  <option value="bakery">Bakery</option>
                  <option value="beverages">Beverages</option>
                  <option value="prepared-foods">Prepared Foods</option>
                  <option value="snacks">Snacks</option>
                  <option value="condiments">Condiments</option>
                  <option value="spices">Spices</option>
                  <option value="health">Health</option>
                  <option value="beauty">Beauty</option>
                  <option value="home">Home</option>
                  <option value="crafts">Crafts</option>
                  <option value="flowers">Flowers</option>
                  <option value="other">Other</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup>
                <label>Status</label>
                <Select
                  value={localFilters.status || ''}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Select>
              </FilterGroup>
              
              <FilterGroup>
                <label>Organic</label>
                <Select
                  value={localFilters.isOrganic || ''}
                  onChange={(e) => handleFilterChange('isOrganic', e.target.value)}
                >
                  <option value="">All Products</option>
                  <option value="true">Organic Only</option>
                  <option value="false">Non-Organic Only</option>
                </Select>
              </FilterGroup>
            </>
          )}
        </FilterGrid>
      </FilterContainer>
      
      {(totalCount > 0 || selectedItems.length > 0) && (
        <ResultsInfo>
          <div className="count">
            {totalCount} total items
            {selectedItems.length > 0 && ` • ${selectedItems.length} selected`}
          </div>
          
          {selectedItems.length > 0 && (
            <div className="actions">
              <Button 
                className="primary" 
                onClick={() => handleBulkAction(type === 'users' ? 'approve' : 'activate')}
                disabled={loading}
              >
                {type === 'users' ? '✅ Bulk Approve' : '✅ Bulk Activate'}
              </Button>
              <Button 
                className="secondary" 
                onClick={() => handleBulkAction(type === 'users' ? 'deactivate' : 'deactivate')}
                disabled={loading}
              >
                🔒 Bulk Deactivate
              </Button>
            </div>
          )}
        </ResultsInfo>
      )}
    </>
  );
};

export default AdminFilters;