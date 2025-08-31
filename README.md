# Ariano Flight Booking System

A comprehensive flight booking system built with Node.js, Express, React, and MySQL. This system provides a complete solution for managing airlines, flights, bookings, customers, and administrative operations.

## Features

### For Customers
- User registration and authentication
- Password reset with security questions
- Flight search and booking
- Multiple passenger booking
- Booking history and management
- Flight rating and reviews
- Grievance submission
- Profile management

### For Airlines
- Airline profile management
- Flight management
- Booking management
- Revenue tracking

### For Administrators
- User management (customers and airlines)
- Airline management
- Flight management
- Booking management
- Grievance handling
- System analytics and reports
- Revenue reports

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

### Frontend
- **React** - UI library
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client
- **Material-UI** - UI components

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd ariano-flight-booking
```

### 2. Backend Setup

#### Install dependencies
```bash
cd server
npm install
```

#### Database Setup
1. Create a MySQL database:
```sql
CREATE DATABASE ariano_flight_booking;
```

2. Copy environment variables:
```bash
cp .env.example .env
```

3. Update `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=ariano_flight_booking
JWT_SECRET=your_super_secret_jwt_key_here
```

4. Run the database schema:
```bash
# Option 1: Using the SQL file
mysql -u your_username -p ariano_flight_booking < database-schema.sql

# Option 2: Using Sequelize (auto-generates tables)
npm run db:sync
```

#### Start the backend server
```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. Frontend Setup

#### Install dependencies
```bash
cd client-app
npm install
```

#### Start the development server
```bash
npm start
```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/change-password` - Change password

### Flights
- `GET /api/flights/search` - Search flights
- `GET /api/flights/:flightId` - Get flight details
- `GET /api/flights/admin/all` - Get all flights (Admin)
- `POST /api/flights` - Create flight (Admin)
- `PUT /api/flights/:flightId` - Update flight (Admin)
- `DELETE /api/flights/:flightId` - Delete flight (Admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/user` - Get user bookings
- `GET /api/bookings/:bookingId` - Get booking details
- `PUT /api/bookings/:bookingId/cancel` - Cancel booking
- `GET /api/bookings/admin/all` - Get all bookings (Admin)
- `PUT /api/bookings/admin/:bookingId/status` - Update booking status (Admin)

### Customer
- `GET /api/customer/profile` - Get customer profile
- `PUT /api/customer/profile` - Update customer profile
- `POST /api/customer/rating` - Submit flight rating
- `GET /api/customer/ratings` - Get user ratings
- `POST /api/customer/grievance` - Submit grievance
- `GET /api/customer/grievances` - Get user grievances
- `GET /api/customer/flight-history` - Get flight history
- `GET /api/customer/stats` - Get customer statistics

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:userId/status` - Update user status
- `DELETE /api/admin/users/:userId` - Delete user
- `POST /api/admin/airlines` - Create airline
- `GET /api/admin/airlines` - Get all airlines
- `PUT /api/admin/airlines/:airId` - Update airline
- `DELETE /api/admin/airlines/:airId` - Delete airline
- `GET /api/admin/customers` - Get all customers
- `PUT /api/admin/customers/:usrId` - Update customer
- `GET /api/admin/grievances` - Get all grievances
- `PUT /api/admin/grievances/:grvId/respond` - Respond to grievance
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/reports/revenue` - Get revenue report
- `GET /api/admin/reports/popular-routes` - Get popular routes

## Database Schema

The system uses the following main tables:
- `users` - User accounts
- `customers` - Customer profiles
- `airlines` - Airline profiles
- `flights` - Flight information
- `bookings` - Booking records
- `passengers` - Passenger information
- `tickets` - Ticket details
- `ratings` - Flight ratings
- `grievances` - Customer complaints
- `controls` - System control parameters

## Default Admin Account

After running the database schema, you can login with:
- **Username:** ADM01
- **Password:** admin123 (hashed in database)

## Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:sync    # Sync database tables
npm run db:reset   # Reset database (WARNING: Deletes all data)
```

### Frontend Scripts
```bash
npm start          # Start development server
npm run build      # Build for production
npm run test       # Run tests
npm run eject      # Eject from Create React App
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting (can be added)
- SQL injection prevention through Sequelize ORM

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@arianoairlines.com or create an issue in the repository.

## Roadmap

- [ ] Email notifications
- [ ] Payment gateway integration
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] API documentation with Swagger
- [ ] Real-time flight updates
- [ ] Loyalty program
- [ ] Third-party integrations (weather, maps, etc.)
