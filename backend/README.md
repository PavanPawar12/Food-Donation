# ShareButes Backend API

A comprehensive Node.js + Express + MongoDB backend for the ShareButes food donation platform.

## 🚀 Features

- **Authentication System**: JWT-based authentication with user registration, login, and profile management
- **User Management**: Support for donors and NGOs with different permissions
- **Food Donations**: Complete CRUD operations for food donations with location-based search
- **Food Requests**: NGO food request management with urgency levels
- **Real-time Statistics**: User impact tracking and donation analytics
- **Location Services**: Geospatial queries for nearby donations and requests
- **Security**: Protected routes, input validation, and error handling

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **Validation**: Built-in Mongoose validation
- **Error Handling**: Custom error middleware
- **CORS**: Cross-origin resource sharing support

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js   # Authentication logic
│   │   ├── donationController.js # Donation management
│   │   └── requestController.js # Food request management
│   ├── middleware/
│   │   ├── authMiddleware.js   # JWT authentication
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js            # User schema
│   │   ├── Donation.js        # Donation schema
│   │   └── Request.js         # Request schema
│   └── routes/
│       ├── authRoutes.js       # Authentication endpoints
│       ├── donationRoutes.js   # Donation endpoints
│       └── requestRoutes.js    # Request endpoints
├── server.js                   # Main server file
├── package.json               # Dependencies
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/sharebutes
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ```

4. **Start the server**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:5000`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "userType": "donor",
  "organization": "Restaurant ABC",
  "phone": "+1234567890",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  }
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <jwt-token>
```

### Donation Endpoints

#### Create Donation
```http
POST /donations
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Fresh Bread Donation",
  "description": "Freshly baked bread from our bakery",
  "foodType": "baked",
  "quantity": {
    "amount": 50,
    "unit": "pieces"
  },
  "allergens": ["wheat"],
  "dietaryRestrictions": ["none"],
  "preparationTime": "2024-01-15T08:00:00Z",
  "expiryTime": "2024-01-16T08:00:00Z",
  "pickupTime": {
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T18:00:00Z"
  },
  "location": {
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    },
    "coordinates": {
      "type": "Point",
      "coordinates": [-74.006, 40.7128]
    }
  }
}
```

#### Get All Donations
```http
GET /donations?page=1&limit=10&status=available&foodType=baked
```

#### Claim Donation (NGOs only)
```http
POST /donations/:id/claim
Authorization: Bearer <jwt-token>
```

### Request Endpoints

#### Create Food Request
```http
POST /requests
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "title": "Urgent Food Need",
  "description": "Need food for homeless shelter",
  "foodTypes": ["cooked", "packaged"],
  "quantity": {
    "amount": 100,
    "unit": "meals"
  },
  "urgency": "high",
  "neededBy": "2024-01-16T18:00:00Z",
  "beneficiaries": {
    "count": 100,
    "type": "homeless",
    "description": "People staying at downtown shelter"
  }
}
```

#### Get Urgent Requests
```http
GET /requests/urgent?limit=20
```

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

## 🗄️ Database Models

### User Model
- **Fields**: name, email, password, userType, organization, phone, address, stats
- **User Types**: donor, ngo, admin
- **Features**: Password hashing, stats tracking, profile management

### Donation Model
- **Fields**: title, description, foodType, quantity, allergens, location, status
- **Status**: available, claimed, picked-up, expired, cancelled
- **Features**: Geospatial indexing, expiry tracking, claim management

### Request Model
- **Fields**: title, description, foodTypes, quantity, urgency, beneficiaries
- **Status**: pending, fulfilled, cancelled, expired
- **Features**: Urgency levels, beneficiary tracking, fulfillment tracking

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Input Validation**: Mongoose schema validation
- **Route Protection**: Middleware-based route protection
- **Error Handling**: Comprehensive error handling without exposing internals
- **CORS**: Configurable cross-origin resource sharing

## 📊 Features

### Location Services
- Geospatial queries for nearby donations/requests
- Radius-based search (configurable in miles)
- Coordinate-based filtering

### Statistics & Analytics
- User impact tracking
- Monthly donation/request statistics
- Beneficiary count tracking
- Urgency level analytics

### Real-time Updates
- Live status updates
- Claim and pickup tracking
- Expiry time monitoring

## 🚀 Development

### Scripts
```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
```

### Environment Variables
- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRE`: JWT token expiration time

## 🔧 Customization

### Adding New Models
1. Create schema in `src/models/`
2. Add controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Update `server.js` with new routes

### Adding New Middleware
1. Create middleware in `src/middleware/`
2. Import and use in routes or `server.js`

### Database Indexes
The models include optimized indexes for:
- Geospatial queries
- User lookups
- Status filtering
- Date-based sorting

## 🐛 Error Handling

The API includes comprehensive error handling:
- Validation errors
- Authentication errors
- Database errors
- Custom business logic errors
- Rate limiting errors

All errors return consistent JSON responses with appropriate HTTP status codes.

## 📈 Performance

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Built-in pagination for large datasets
- **Population**: Efficient data population for related documents
- **Caching**: Ready for Redis integration

## 🔮 Future Enhancements

- **File Upload**: Image upload for donations
- **Notifications**: Real-time notifications system
- **Email Service**: Automated email notifications
- **Analytics Dashboard**: Advanced reporting and analytics
- **Mobile App API**: Optimized endpoints for mobile applications

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support and questions, please open an issue in the repository.
