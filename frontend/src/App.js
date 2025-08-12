import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import MerchantProfile from './pages/MerchantProfile';
import MerchantDashboard from './pages/MerchantDashboard';
import CustomerDashboard from './pages/CustomerDashboard';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import HowItWorks from './pages/HowItWorks';
import Contact from './pages/Contact';
import DeliveryInfo from './pages/DeliveryInfo';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import PrivateRoute from './components/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <div className="App">
            <Header />
            <main style={{ minHeight: 'calc(100vh - 140px)' }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="/merchant/:id" element={<MerchantProfile />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/delivery" element={<DeliveryInfo />} />
                <Route 
                  path="/welcome" 
                  element={
                    <PrivateRoute>
                      <Welcome />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/checkout" 
                  element={
                    <PrivateRoute>
                      <Checkout />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard/customer" 
                  element={
                    <PrivateRoute>
                      <CustomerDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/dashboard/merchant" 
                  element={
                    <PrivateRoute requiredRole="merchant">
                      <MerchantDashboard />
                    </PrivateRoute>
                  } 
                />
                <Route 
                  path="/settings" 
                  element={
                    <PrivateRoute>
                      <Settings />
                    </PrivateRoute>
                  } 
                />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;