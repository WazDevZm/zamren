# FRA Digital Platform - Backend

## Setup Instructions

1. Install dependencies:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your actual credentials
```

3. Start MongoDB (ensure MongoDB is running locally or use MongoDB Atlas)

4. Run the server:
```bash
npm run dev
```

The server will start on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Farmers
- GET /api/farmers - Get all farmers
- POST /api/farmers - Register new farmer
- GET /api/farmers/:id - Get farmer by ID
- PUT /api/farmers/:id - Update farmer
- PATCH /api/farmers/:id/verify - Verify farmer

### Farms
- GET /api/farms - Get all farms
- POST /api/farms - Register new farm
- GET /api/farms/:id - Get farm by ID
- PUT /api/farms/:id - Update farm

### FISP
- POST /api/fisp/check-eligibility - Check farmer eligibility
- POST /api/fisp/apply - Apply for FISP
- GET /api/fisp - Get FISP records
- POST /api/fisp/:id/vouchers - Generate voucher
- POST /api/fisp/vouchers/redeem - Redeem voucher

### Payments
- GET /api/payments - Get all payments
- POST /api/payments - Create payment
- POST /api/payments/:id/process - Process payment
- GET /api/payments/:id - Get payment by ID

### Logistics
- GET /api/logistics - Get all produce
- POST /api/logistics - Create produce record
- PATCH /api/logistics/:id/logistics - Update logistics status
- GET /api/logistics/track/:trackingCode - Track produce

### Storage
- GET /api/storage - Get all storage facilities
- POST /api/storage - Create storage facility
- POST /api/storage/:id/store - Store produce
- GET /api/storage/:id/inventory - Get storage inventory

### Reports
- GET /api/reports/dashboard - Get dashboard statistics
- GET /api/reports/payments - Get payment reports
- GET /api/reports/farmers/export - Export farmers to CSV

## Features Implemented

✅ User authentication with JWT
✅ Role-based access control (farmer, agent, admin, logistics, finance)
✅ Farmer registration with biometric data support
✅ Farm geolocation mapping
✅ FISP eligibility checking and voucher management
✅ Payment processing with multiple gateways (Stripe, Mobile Money, Bank)
✅ Logistics tracking with QR codes
✅ Storage facility management
✅ Real-time notifications (SMS/Email)
✅ Dashboard analytics
✅ Data export (CSV)
✅ RESTful API architecture
✅ MongoDB database with proper relationships

## Payment Integrations

- Stripe (Credit/Debit cards)
- MTN Mobile Money
- Airtel Money
- Bank transfers

## Notification Services

- SMS via Twilio
- Email via Nodemailer
