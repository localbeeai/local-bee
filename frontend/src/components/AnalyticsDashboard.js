import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from '../config/api';

const AnalyticsContainer = styled.div`
  padding: 2rem 0;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
`;

const StatCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: var(--shadow);
  border-left: 4px solid ${props => props.color || 'var(--primary-green)'};
  
  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .stat-icon {
      font-size: 2rem;
      opacity: 0.8;
    }
  }
  
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-dark);
    margin-bottom: 0.25rem;
  }
  
  .stat-label {
    color: var(--text-light);
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-change {
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    &.positive {
      color: #16a34a;
    }
    
    &.negative {
      color: #dc2626;
    }
    
    &.neutral {
      color: var(--text-light);
    }
  }
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  margin-bottom: 2rem;
  
  h3 {
    color: var(--text-dark);
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }
`;

const SimpleChart = styled.div`
  .chart-bar {
    display: flex;
    align-items: center;
    margin-bottom: 0.75rem;
    
    .bar-label {
      min-width: 100px;
      font-size: 0.875rem;
      color: var(--text-dark);
    }
    
    .bar-track {
      flex: 1;
      height: 20px;
      background: var(--border-light);
      border-radius: 10px;
      margin: 0 1rem;
      overflow: hidden;
    }
    
    .bar-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--primary-green), var(--secondary-green));
      border-radius: 10px;
      transition: width 0.5s ease;
    }
    
    .bar-value {
      min-width: 60px;
      text-align: right;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--text-dark);
    }
  }
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  
  button {
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
  }
`;

const TopProductsList = styled.div`
  .product-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 0;
    border-bottom: 1px solid var(--border-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .product-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      
      .product-image {
        width: 40px;
        height: 40px;
        border-radius: 0.5rem;
        background: var(--natural-beige);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.25rem;
      }
      
      .product-details {
        .product-name {
          font-weight: 600;
          color: var(--text-dark);
          margin-bottom: 0.25rem;
        }
        
        .product-category {
          font-size: 0.875rem;
          color: var(--text-light);
        }
      }
    }
    
    .product-stats {
      text-align: right;
      
      .stat-value {
        font-weight: 600;
        color: var(--primary-green);
        margin-bottom: 0.25rem;
      }
      
      .stat-label {
        font-size: 0.875rem;
        color: var(--text-light);
      }
    }
  }
`;

const AnalyticsDashboard = ({ userRole = 'merchant', userId = null }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, userId]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const endpoint = userRole === 'admin' 
        ? '/api/admin/analytics' 
        : '/api/users/analytics';
      
      const response = await axios.get(`${endpoint}?timeRange=${timeRange}`);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Mock data for demonstration
      setAnalytics(getMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  const getMockAnalytics = () => ({
    overview: {
      totalRevenue: 2850,
      totalOrders: 42,
      totalProducts: 15,
      averageOrderValue: 67.86,
      revenueChange: 12.5,
      ordersChange: 8.3,
      productsChange: 0,
      aovChange: 4.2
    },
    salesChart: [
      { date: '2023-12-01', sales: 420 },
      { date: '2023-12-02', sales: 580 },
      { date: '2023-12-03', sales: 320 },
      { date: '2023-12-04', sales: 740 },
      { date: '2023-12-05', sales: 890 },
      { date: '2023-12-06', sales: 650 },
      { date: '2023-12-07', sales: 470 }
    ],
    topProducts: [
      { name: 'Organic Tomatoes', category: 'Vegetables', sales: 24, revenue: 120 },
      { name: 'Fresh Basil', category: 'Herbs', sales: 18, revenue: 90 },
      { name: 'Artisan Bread', category: 'Bakery', sales: 15, revenue: 75 },
      { name: 'Local Honey', category: 'Pantry', sales: 12, revenue: 180 },
      { name: 'Farm Eggs', category: 'Dairy', sales: 28, revenue: 84 }
    ],
    categoryStats: [
      { category: 'Vegetables', percentage: 35, sales: 156 },
      { category: 'Dairy', percentage: 28, sales: 124 },
      { category: 'Bakery', percentage: 20, sales: 89 },
      { category: 'Herbs', percentage: 12, sales: 53 },
      { category: 'Pantry', percentage: 5, sales: 22 }
    ]
  });

  const timeRanges = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' }
  ];

  const formatChange = (change) => {
    if (change > 0) return { text: `+${change}%`, class: 'positive', icon: '↗️' };
    if (change < 0) return { text: `${change}%`, class: 'negative', icon: '↘️' };
    return { text: 'No change', class: 'neutral', icon: '→' };
  };

  if (loading) {
    return (
      <AnalyticsContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <div>Loading analytics...</div>
        </div>
      </AnalyticsContainer>
    );
  }

  if (!analytics) {
    return (
      <AnalyticsContainer>
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>❌</div>
          <div>Unable to load analytics data</div>
        </div>
      </AnalyticsContainer>
    );
  }

  return (
    <AnalyticsContainer>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--text-dark)', marginBottom: '1rem' }}>
          📊 Analytics Dashboard
        </h2>
        <TimeRangeSelector>
          {timeRanges.map(range => (
            <button
              key={range.value}
              $active={timeRange === range.value}
              onClick={() => setTimeRange(range.value)}
            >
              {range.label}
            </button>
          ))}
        </TimeRangeSelector>
      </div>

      <StatsGrid>
        <StatCard color="#16a34a">
          <div className="stat-header">
            <div className="stat-icon">💰</div>
          </div>
          <div className="stat-number">${analytics.overview.totalRevenue.toLocaleString()}</div>
          <div className="stat-label">Total Revenue</div>
          <div className={`stat-change ${formatChange(analytics.overview.revenueChange).class}`}>
            <span>{formatChange(analytics.overview.revenueChange).icon}</span>
            <span>{formatChange(analytics.overview.revenueChange).text}</span>
          </div>
        </StatCard>

        <StatCard color="#3b82f6">
          <div className="stat-header">
            <div className="stat-icon">📦</div>
          </div>
          <div className="stat-number">{analytics.overview.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
          <div className={`stat-change ${formatChange(analytics.overview.ordersChange).class}`}>
            <span>{formatChange(analytics.overview.ordersChange).icon}</span>
            <span>{formatChange(analytics.overview.ordersChange).text}</span>
          </div>
        </StatCard>

        <StatCard color="#f59e0b">
          <div className="stat-header">
            <div className="stat-icon">🛍️</div>
          </div>
          <div className="stat-number">{analytics.overview.totalProducts}</div>
          <div className="stat-label">Active Products</div>
          <div className={`stat-change ${formatChange(analytics.overview.productsChange).class}`}>
            <span>{formatChange(analytics.overview.productsChange).icon}</span>
            <span>{formatChange(analytics.overview.productsChange).text}</span>
          </div>
        </StatCard>

        <StatCard color="#8b5cf6">
          <div className="stat-header">
            <div className="stat-icon">💵</div>
          </div>
          <div className="stat-number">${analytics.overview.averageOrderValue.toFixed(2)}</div>
          <div className="stat-label">Avg Order Value</div>
          <div className={`stat-change ${formatChange(analytics.overview.aovChange).class}`}>
            <span>{formatChange(analytics.overview.aovChange).icon}</span>
            <span>{formatChange(analytics.overview.aovChange).text}</span>
          </div>
        </StatCard>
      </StatsGrid>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <ChartContainer>
          <h3>📈 Sales by Category</h3>
          <SimpleChart>
            {analytics.categoryStats.map((category, index) => (
              <div key={index} className="chart-bar">
                <div className="bar-label">{category.category}</div>
                <div className="bar-track">
                  <div 
                    className="bar-fill" 
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="bar-value">{category.sales} sales</div>
              </div>
            ))}
          </SimpleChart>
        </ChartContainer>

        <ChartContainer>
          <h3>🏆 Top Products</h3>
          <TopProductsList>
            {analytics.topProducts.slice(0, 5).map((product, index) => (
              <div key={index} className="product-item">
                <div className="product-info">
                  <div className="product-image">
                    {product.category === 'Vegetables' ? '🥕' : 
                     product.category === 'Herbs' ? '🌿' :
                     product.category === 'Bakery' ? '🍞' :
                     product.category === 'Pantry' ? '🍯' :
                     product.category === 'Dairy' ? '🥚' : '📦'}
                  </div>
                  <div className="product-details">
                    <div className="product-name">{product.name}</div>
                    <div className="product-category">{product.category}</div>
                  </div>
                </div>
                <div className="product-stats">
                  <div className="stat-value">${product.revenue}</div>
                  <div className="stat-label">{product.sales} sold</div>
                </div>
              </div>
            ))}
          </TopProductsList>
        </ChartContainer>
      </div>
    </AnalyticsContainer>
  );
};

export default AnalyticsDashboard;