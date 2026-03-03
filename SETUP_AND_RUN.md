# FRA Digital Platform - Setup & Run Guide

## Current Status ✅

### Backend (Running on Port 3001)
- **Status**: Running
- **URL**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Base**: http://localhost:3001/api

### Mobile App (iOS Simulator)
- **Status**: Running
- **Platform**: iOS Simulator (iPhone 17 Pro Max)
- **Connected to**: http://localhost:3001/api

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

Backend will start on port 3001 and connect to MongoDB at `mongodb://localhost:27017/fra_platform`

### Mobile App
```bash
cd app
npm install
npm run ios      # For iOS
npm run android  # For Android
```

## Testing the Connection

### 1. Check Backend Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{"status":"ok","timestamp":"2026-03-03T09:23:02.925Z"}
```

### 2. Test User Registration
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fra.zm",
    "password": "admin123",
    "role": "admin",
    "phone": "+260971234567",
    "firstName": "Admin",
    "lastName": "User"
  }'
```

### 3. Test Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@fra.zm",
    "password": "admin123"
  }'
```

## Mobile App Features

### Available Screens:
1. **Login/Register** - User authentication
2. **Dashboard** - Statistics and analytics
3. **Farmers** - List and register farmers
4. **FISP** - Voucher management
5. **Payments** - Transaction history
6. **Logistics** - Produce tracking

### Default Test Credentials:
Create an admin user first using the registration endpoint above, then login with:
- Email: admin@fra.zm
- Password: admin123

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Farmers
- GET `/api/farmers` - Get all farmers
- POST `/api/farmers` - Register new farmer
- GET `/api/farmers/:id` - Get farmer by ID
- PUT `/api/farmers/:id` - Update farmer
- PATCH `/api/farmers/:id/verify` - Verify farmer

### Farms
- GET `/api/farms` - Get all farms
- POST `/api/farms` - Register new farm
- GET `/api/farms/:id` - Get farm by ID
- PUT `/api/farms/:id` - Update farm

### FISP
- POST `/api/fisp/check-eligibility` - Check eligibility
- POST `/api/fisp/apply` - Apply for FISP
- GET `/api/fisp` - Get FISP records
- POST `/api/fisp/:id/vouchers` - Generate voucher
- POST `/api/fisp/vouchers/redeem` - Redeem voucher

### Payments
- GET `/api/payments` - Get all payments
- POST `/api/payments` - Create payment
- POST `/api/payments/:id/process` - Process payment
- GET `/api/payments/:id` - Get payment by ID

### Logistics
- GET `/api/logistics` - Get all produce
- POST `/api/logistics` - Create produce record
- PATCH `/api/logistics/:id/logistics` - Update status
- GET `/api/logistics/track/:trackingCode` - Track produce

### Storage
- GET `/api/storage` - Get all storage facilities
- POST `/api/storage` - Create storage facility
- POST `/api/storage/:id/store` - Store produce
- GET `/api/storage/:id/inventory` - Get inventory

### Reports
- GET `/api/reports/dashboard` - Dashboard statistics
- GET `/api/reports/payments` - Payment reports
- GET `/api/reports/farmers/export` - Export farmers CSV

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
```bash
# Make sure MongoDB is running
brew services start mongodb-community
# Or
mongod --dbpath /path/to/data
```

**Port Already in Use:**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

### Mobile App Issues

**Metro Bundler Issues:**
```bash
cd app
rm -rf node_modules
npm install
npm start -- --reset-cache
```

**iOS Simulator Not Opening:**
```bash
# Open Xcode and install iOS simulators
xcode-select --install
```

## Environment Variables

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/fra_platform
JWT_SECRET=fra_secret_key_2024_secure_token_12345
JWT_EXPIRE=7d
```

### Mobile App
API URL is configured in `app/services/api.ts`:
```typescript
const API_URL = 'http://localhost:3001/api';
```

## Next Steps

1. ✅ Backend running on port 3001
2. ✅ Mobile app running on iOS simulator
3. ✅ API communication configured
4. 📝 Create admin user via API
5. 📱 Login to mobile app
6. 🎯 Start testing features

## Support

For issues or questions, check:
- Backend logs in terminal running `npm run dev`
- Mobile app logs in Metro bundler terminal
- MongoDB logs if database issues occur
