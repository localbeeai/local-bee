import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    color: var(--text-dark);
    margin: 0;
    font-size: 1.25rem;
  }
  
  button {
    background: none;
    border: none;
    color: var(--primary-green);
    cursor: pointer;
    font-size: 0.875rem;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const SearchBox = styled.div`
  position: relative;
  margin-bottom: 1.5rem;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 2px solid var(--border-light);
    border-radius: 0.5rem;
    font-size: 1rem;
    transition: border-color 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--primary-green);
    }
    
    &::placeholder {
      color: var(--text-light);
    }
  }
  
  .search-icon {
    position: absolute;
    left: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-light);
    font-size: 1.25rem;
  }
  
  .clear-search {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-light);
    cursor: pointer;
    font-size: 1.25rem;
    
    &:hover {
      color: var(--text-dark);
    }
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  h4 {
    color: var(--text-dark);
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    text-transform: uppercase;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid var(--border-light);
  border-radius: 0.25rem;
  background: white;
  color: var(--text-dark);
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary-green);
  }
`;

const PriceInputs = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 0.5rem;
  align-items: center;
  
  input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid var(--border-light);
    border-radius: 0.25rem;
    font-size: 0.875rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary-green);
    }
  }
  
  span {
    color: var(--text-light);
    font-size: 0.875rem;
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  color: var(--text-dark);
  
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: var(--primary-green);
  }
  
  &:hover {
    color: var(--primary-green);
  }
`;

const SortOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-light);
`;

const SortButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-light);
  background: ${props => props.$active ? 'var(--primary-green)' : 'white'};
  color: ${props => props.$active ? 'white' : 'var(--text-dark)'};
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:hover {
    background: var(--primary-green);
    color: white;
    border-color: var(--primary-green);
  }
`;

const ProductFilters = ({ 
  filters, 
  onFiltersChange, 
  categories = [], 
  subcategories = [],
  loading = false 
}) => {
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const updateFilter = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const updatePriceFilter = (type, value) => {
    const newFilters = { 
      ...localFilters, 
      [type]: value === '' ? undefined : parseFloat(value) 
    };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      category: '',
      subcategory: '',
      minPrice: undefined,
      maxPrice: undefined,
      isOrganic: undefined,
      isLocallySourced: undefined,
      sort: '-createdAt'
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'name', label: 'Name: A to Z' },
    { value: '-name', label: 'Name: Z to A' }
  ];

  const hasActiveFilters = localFilters.search || 
    localFilters.category || 
    localFilters.subcategory || 
    localFilters.minPrice !== undefined || 
    localFilters.maxPrice !== undefined || 
    localFilters.isOrganic !== undefined || 
    localFilters.isLocallySourced !== undefined;

  return (
    <FilterContainer>
      <FilterHeader>
        <h3>🔍 Search & Filter</h3>
        {hasActiveFilters && (
          <button onClick={clearAllFilters}>Clear All</button>
        )}
      </FilterHeader>

      <SearchBox>
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Search products, merchants, or keywords..."
          value={localFilters.search || ''}
          onChange={(e) => updateFilter('search', e.target.value)}
        />
        {localFilters.search && (
          <button 
            className="clear-search"
            onClick={() => updateFilter('search', '')}
          >
            ✕
          </button>
        )}
      </SearchBox>

      <FilterGrid>
        <FilterGroup>
          <h4>Category</h4>
          <Select
            value={localFilters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
              </option>
            ))}
          </Select>
        </FilterGroup>

        {localFilters.category && (
          <FilterGroup>
            <h4>Subcategory</h4>
            <Select
              value={localFilters.subcategory || ''}
              onChange={(e) => updateFilter('subcategory', e.target.value)}
            >
              <option value="">All Subcategories</option>
              {subcategories.filter(sub => sub.category === localFilters.category).map(sub => (
                <option key={sub.name} value={sub.name}>
                  {sub.name}
                </option>
              ))}
            </Select>
          </FilterGroup>
        )}

        <FilterGroup>
          <h4>Price Range</h4>
          <PriceInputs>
            <input
              type="number"
              placeholder="Min"
              min="0"
              step="0.01"
              value={localFilters.minPrice || ''}
              onChange={(e) => updatePriceFilter('minPrice', e.target.value)}
            />
            <span>to</span>
            <input
              type="number"
              placeholder="Max"
              min="0"
              step="0.01"
              value={localFilters.maxPrice || ''}
              onChange={(e) => updatePriceFilter('maxPrice', e.target.value)}
            />
          </PriceInputs>
        </FilterGroup>

        <FilterGroup>
          <h4>Special Attributes</h4>
          <CheckboxGroup>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.isOrganic === 'true'}
                onChange={(e) => updateFilter('isOrganic', e.target.checked ? 'true' : undefined)}
              />
              🌱 Organic Certified
            </CheckboxLabel>
            <CheckboxLabel>
              <input
                type="checkbox"
                checked={localFilters.isLocallySourced === 'true'}
                onChange={(e) => updateFilter('isLocallySourced', e.target.checked ? 'true' : undefined)}
              />
              📍 Locally Sourced
            </CheckboxLabel>
          </CheckboxGroup>
        </FilterGroup>
      </FilterGrid>

      <SortOptions>
        <span style={{ 
          color: 'var(--text-light)', 
          fontSize: '0.875rem', 
          alignSelf: 'center',
          marginRight: '0.5rem'
        }}>
          Sort by:
        </span>
        {sortOptions.map(option => (
          <SortButton
            key={option.value}
            $active={localFilters.sort === option.value}
            onClick={() => updateFilter('sort', option.value)}
          >
            {option.label}
          </SortButton>
        ))}
      </SortOptions>
    </FilterContainer>
  );
};

export default ProductFilters;