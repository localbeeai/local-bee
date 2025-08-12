# LocalMarket 🌱

A local marketplace web application connecting customers with local merchants, built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

### Current Features
- ✅ User authentication (login/signup) for both customers and merchants
- ✅ Role-based access control (customers vs merchants)
- ✅ Responsive design with green/natural color theme
- ✅ MongoDB database models for Users, Products, and Orders
- ✅ JWT-based authentication
- ✅ Basic routing and protected routes

### Upcoming Features
- 🔄 Product management system for merchants
- 🔄 Product browsing and search functionality
- 🔄 Location-based search (zip code, radius)
- 🔄 Shopping cart and checkout
- 🔄 Order management
- 🔄 Image upload for products
- 🔄 Delivery options (pickup, same-day, standard)
- 🔄 Payment integration
- 🔄 Reviews and ratings

## Local Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (running locally or MongoDB Atlas)
- Git

### 1. Clone and Install Dependencies

```bash
# Navigate to the project directory
cd C:\Users\colli\Desktop\localmarket

# Install root dependencies
npm install

# Install backend dependencies
npm run install-server

# Install frontend dependencies
npm run install-client
```

### 2. Set Up Environment Variables

Edit the backend `.env` file located at `backend/.env`:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/localmarket
JWT_SECRET=your_very_secure_jwt_secret_key_change_this
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Important:** Change the JWT_SECRET to a secure random string in production.

### 3. Set Up MongoDB

#### Option A: Local MongoDB
1. Install MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/localmarket`

#### Option B: MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/atlas
2. Create a new cluster
3. Get your connection string and update `MONGODB_URI` in the `.env` file

### 4. Run the Application

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run them separately:
# Backend only (runs on http://localhost:5000)
npm run server

# Frontend only (runs on http://localhost:3000)
npm run client
```

### 5. Access the Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## Project Structure

```
localmarket/
├── backend/                 # Express.js backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication middleware
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── .env               # Environment variables
│   ├── package.json       # Backend dependencies
│   └── server.js          # Entry point
├── frontend/               # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context (Auth)
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   ├── App.js         # Main app component
│   │   └── index.js       # Entry point
│   └── package.json       # Frontend dependencies
├── package.json           # Root package.json
└── README.md             # This file
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Products (Coming Soon)
- `GET /api/products` - Get all products
- `POST /api/products` - Create new product (merchants only)
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Orders (Coming Soon)
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **Cloudinary** - Image hosting

### Frontend
- **React** - Frontend framework
- **React Router** - Routing
- **Styled Components** - CSS-in-JS styling
- **React Query** - Data fetching
- **React Hook Form** - Form handling
- **Axios** - HTTP client
- **Heroicons** - Icons

## Color Theme

The app uses a natural, green-focused color palette:
- Primary Green: #22c55e
- Secondary Green: #dcfce7
- Accent Green: #bbf7d0
- Natural Beige: #f5f5f4
- Text Dark: #1f2937

## Contributing

This is a local development project. To add new features:

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

MIT License - feel free to use this project as a template for your own local marketplace!

## Support

For questions or issues, please create an issue in the project repository.

---

🌱 **LocalMarket** - Connecting communities through local commerce