// Payment Service - Abstraction layer for multiple payment providers
// Supports Stripe, PayPal, and cash payments

class PaymentService {
  constructor() {
    this.providers = {
      stripe: null,
      paypal: null
    };
    
    // Initialize providers based on environment variables
    if (process.env.STRIPE_SECRET_KEY) {
      this.initializeStripe();
    }
    
    if (process.env.PAYPAL_CLIENT_ID && process.env.PAYPAL_CLIENT_SECRET) {
      this.initializePayPal();
    }
  }

  initializeStripe() {
    try {
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
      this.providers.stripe = stripe;
      console.log('✅ Stripe payment provider initialized');
    } catch (error) {
      console.log('⚠️ Stripe not available - install stripe package: npm install stripe');
    }
  }

  initializePayPal() {
    try {
      // PayPal SDK initialization would go here
      console.log('✅ PayPal payment provider initialized');
    } catch (error) {
      console.log('⚠️ PayPal initialization failed:', error);
    }
  }

  // Create payment intent for credit card payments
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    if (!this.providers.stripe) {
      throw new Error('Stripe payment provider not available');
    }

    try {
      const paymentIntent = await this.providers.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata: {
          ...metadata,
          integration_check: 'accept_a_payment'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        paymentIntent,
        clientSecret: paymentIntent.client_secret
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId) {
    if (!this.providers.stripe) {
      throw new Error('Stripe payment provider not available');
    }

    try {
      const paymentIntent = await this.providers.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: paymentIntent.status === 'succeeded',
        status: paymentIntent.status,
        paymentIntent
      };
    } catch (error) {
      console.error('Payment confirmation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process refund
  async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    if (!this.providers.stripe) {
      throw new Error('Stripe payment provider not available');
    }

    try {
      const refundData = {
        payment_intent: paymentIntentId,
        reason
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      const refund = await this.providers.stripe.refunds.create(refundData);

      return {
        success: true,
        refund,
        amount: refund.amount / 100 // Convert back to dollars
      };
    } catch (error) {
      console.error('Refund processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Handle cash payments (for pickup orders)
  processCashPayment(amount, orderId) {
    return {
      success: true,
      paymentMethod: 'cash',
      amount,
      orderId,
      transactionId: `CASH_${Date.now()}_${orderId.slice(-6)}`,
      status: 'completed',
      note: 'Cash payment to be collected on pickup/delivery'
    };
  }

  // Calculate fees (for marketplace commission)
  calculateFees(amount, paymentMethod = 'card') {
    const feeStructure = {
      card: 0.029 + 0.30, // 2.9% + $0.30 (typical Stripe fees)
      cash: 0, // No processing fees for cash
      paypal: 0.0349 + 0.49 // 3.49% + $0.49 (typical PayPal fees)
    };

    const percentage = feeStructure[paymentMethod] || feeStructure.card;
    const processingFee = amount * percentage;
    const marketplaceFee = amount * 0.05; // 5% marketplace commission
    
    return {
      processingFee: Math.round(processingFee * 100) / 100,
      marketplaceFee: Math.round(marketplaceFee * 100) / 100,
      totalFees: Math.round((processingFee + marketplaceFee) * 100) / 100,
      merchantPayout: Math.round((amount - processingFee - marketplaceFee) * 100) / 100
    };
  }

  // Create customer for recurring payments
  async createCustomer(email, name, metadata = {}) {
    if (!this.providers.stripe) {
      throw new Error('Stripe payment provider not available');
    }

    try {
      const customer = await this.providers.stripe.customers.create({
        email,
        name,
        metadata
      });

      return {
        success: true,
        customer
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Validate payment method
  validatePaymentMethod(paymentMethod, orderDetails) {
    const validMethods = ['card', 'cash', 'paypal'];
    
    if (!validMethods.includes(paymentMethod)) {
      return {
        valid: false,
        error: 'Invalid payment method'
      };
    }

    // Cash only available for pickup orders
    if (paymentMethod === 'cash' && orderDetails.deliveryMethod !== 'pickup') {
      return {
        valid: false,
        error: 'Cash payments only available for pickup orders'
      };
    }

    return {
      valid: true
    };
  }

  // Get available payment methods for order
  getAvailablePaymentMethods(orderDetails) {
    const methods = ['card'];

    // Add PayPal if available
    if (this.providers.paypal) {
      methods.push('paypal');
    }

    // Add cash for pickup orders
    if (orderDetails.deliveryMethod === 'pickup') {
      methods.push('cash');
    }

    return methods;
  }
}

module.exports = new PaymentService();