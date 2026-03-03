# FRA Digital Platform

A comprehensive digital platform for the Food Reserve Agency (FRA) that modernizes agricultural supply chain management, from farmer registration to produce storage.

## Project Structure

```
├── app/                    # React Native mobile application
│   ├── app/               # App screens and navigation
│   ├── components/        # Reusable UI components
│   ├── services/          # API integration
│   └── context/           # React context (Auth, etc.)
│
└── backend/               # Node.js/Express backend
    ├── src/
    │   ├── models/        # MongoDB models
    │   ├── routes/        # API routes
    │   ├── services/      # Business logic
    │   └── middleware/    # Auth & validation
    └── server.js          # Entry point
```

## Features

### 1. Farmer & Farm Tracking Module
- Digital farmer registration with biometric/ID verification
- Farm geolocation mapping (GPS coordinates)
- Farmer profile management
- Farm history and production records
- Dashboard showing registered farmers by region

### 2. FISP Module
- Subsidy eligibility verification
- Input voucher generation (seeds, fertilizer, equipment)
- E-voucher redemption system
- Stock level tracking
- Beneficiary analytics
- Fraud detection (prevent double-dipping)

### 3. Farmer Payment System
- Secure digital wallet integration
- Automated payment calculations
- Payment authorization workflow
- Mobile money integration (MTN, Airtel)
- Bank account payments
- Payment history and receipts
- Bulk payment processing

### 4. Logistics & Produce Tracking
- Produce collection scheduling
- Real-time tracking (farm → collection point → storage)
- Quality grading and weighing records
- Storage facility management
- Inventory management
- QR code/barcode tracking

### 5. Banking & Payment Gateway Integration
- Stripe integration
- Mobile money APIs (MTN, Airtel)
- Bank API integration
- Transaction reconciliation
- Automated settlement

## Technology Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT authentication
- Stripe payment gateway
- Twilio (SMS notifications)
- Nodemailer (Email notifications)

### Mobile App
- React Native + Expo
- TypeScript
- Expo Router (navigation)
- Axios (API calls)
- AsyncStorage (local storage)
- React Native Maps (geolocation)

## Getting Started

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your credentials
```

4. Start the server:
```bash
npm run dev
```

### Mobile App Setup

1. Navigate to app directory:
```bash
cd app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on device/emulator:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## User Roles

- **Farmer**: View own farms, payments, FISP vouchers
- **Agent**: Register farmers, verify farmers, manage FISP
- **Admin**: Full system access, user management
- **Logistics**: Manage produce tracking, storage
- **Finance**: Process payments, view financial reports

## Security Features

- JWT-based authentication
- Role-based access control
- Password hashing (bcrypt)
- Rate limiting
- Helmet.js security headers
- Input validation

## Mobile App Screens

- Login/Register
- Dashboard (statistics & analytics)
- Farmers List & Registration
- FISP Management
- Payments & Transactions
- Logistics & Tracking
- Profile & Settings

## License

Proprietary - Food Reserve Agency
