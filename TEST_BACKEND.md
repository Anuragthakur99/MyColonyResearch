# Backend Testing Guide

## 1. Start the Backend Server

```bash
cd backend
npm install
npm run dev
```

## 2. Seed Sample Data

```bash
node seedData.js
```

## 3. Test API Endpoints

### Test Login with Sample User:
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "priya@example.com",
    "password": "password123"
  }'
```

### Test Admin Login:
```bash
curl -X POST http://localhost:3000/api/v1/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@mycolony.com", 
    "password": "admin123"
  }'
```

### Get All Colonies:
```bash
curl http://localhost:3000/api/v1/colony/get
```

### Get All Services:
```bash
curl http://localhost:3000/api/v1/service/get
```

## 4. Frontend Login Credentials

**Admin:**
- Email: admin@mycolony.com
- Password: admin123

**Resident:**
- Email: priya@example.com
- Password: password123

**Another Resident:**
- Email: rajesh@example.com
- Password: password123

## 5. Troubleshooting

If login fails:
1. Check if MongoDB is running
2. Verify environment variables in .env
3. Run seed script to create sample data
4. Check server logs for errors

## 6. Database Structure

The system now uses:
- **Users**: Residents and admins with colony association
- **Colonies**: Residential complexes
- **Services**: Services offered by residents
- **ServiceRequests**: Booking requests (future feature)