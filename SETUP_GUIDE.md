# Nefol Beauty Brand - Complete Admin & User Panel System

A comprehensive e-commerce platform for Nefol beauty brand with advanced customer engagement features, analytics, and management tools.

## 🚀 Features

### Core Business Features
- **Dashboard** - Overview of business metrics and KPIs
- **Orders Management** - Complete order processing and tracking
- **Products Management** - Inventory and catalog management
- **Customers Management** - Customer database and profiles
- **Invoice System** - Automated invoicing and billing
- **Tax Management** - Tax calculation and reporting
- **Returns Management** - Return processing and tracking
- **Payment Processing** - Multiple payment gateway integration
- **Categories Management** - Product categorization
- **Marketing Tools** - Campaign management and analytics
- **Discounts** - Promotional codes and offers

### Customer Engagement Features
- **⭐ Loyalty Program** - Points-based rewards system
- **🤝 Affiliate Program** - Commission-based referral system
- **💰 Cashback System** - Cashback rewards on purchases
- **📧 Email Marketing** - Automated email campaigns
- **📱 SMS Marketing** - SMS campaign management
- **🔔 Push Notifications** - Web push notifications
- **💬 WhatsApp Chat** - WhatsApp Business API integration
- **💬 Live Chat** - Real-time customer support
- **📊 Advanced Analytics** - Comprehensive business analytics
- **📝 Form Builder** - Custom form creation
- **⚙️ Workflow Automation** - Automated business processes

### Advanced Features
- **🎯 Customer Segmentation** - Advanced customer targeting
- **🗺️ Journey Tracking** - Customer journey analytics
- **📈 Actionable Analytics** - Data-driven insights
- **🤖 AI Box** - AI-powered features
- **🔄 Journey Funnel** - Conversion funnel analysis
- **🎨 AI Personalization** - Personalized experiences
- **👥 Custom Audience** - Audience targeting
- **🌐 Omni Channel** - Multi-channel marketing
- **🔧 API Manager** - API key and configuration management

## 🏗️ Architecture

### Monorepo Structure
```
rahul-nefol/
├── admin-panel/          # Admin dashboard (React + TypeScript)
├── user-panel/          # Customer-facing website (React + TypeScript)
├── backend/             # API server (Node.js + Express + PostgreSQL)
├── common/              # Shared utilities and types
└── scripts/             # Deployment and utility scripts
```

### Technology Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with comprehensive schema
- **Real-time**: Socket.IO for live updates
- **Authentication**: JWT-based authentication
- **File Upload**: Multer for file handling
- **API**: RESTful API with comprehensive endpoints

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/pnpm
- PostgreSQL 14+
- Git

### 1. Clone and Install Dependencies
```bash
git clone <repository-url>
cd rahul-nefol
pnpm install
```

### 2. Database Setup
```bash
# Create PostgreSQL database
createdb nefol

# Or using psql
psql -U postgres
CREATE DATABASE nefol;
```

### 3. Environment Configuration

#### Backend Environment (`backend/.env`)
```env
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
DATABASE_URL=postgresql://postgres:password@localhost:5432/nefol

# API Keys (Add your actual keys)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret

# Email Service
SENDGRID_API_KEY=your_sendgrid_api_key
MAILGUN_API_KEY=your_mailgun_api_key

# SMS Service
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# Push Notifications
FIREBASE_SERVER_KEY=your_firebase_server_key

# WhatsApp Business API
WHATSAPP_ACCESS_TOKEN=your_whatsapp_access_token
WHATSAPP_PHONE_NUMBER_ID=your_whatsapp_phone_number_id

# Analytics
GOOGLE_ANALYTICS_ID=your_google_analytics_id
FACEBOOK_PIXEL_ID=your_facebook_pixel_id

# AI Services
OPENAI_API_KEY=your_openai_api_key
ANTHROPIC_API_KEY=your_anthropic_api_key

# Security
JWT_SECRET=your_jwt_secret_key_here
ENCRYPTION_KEY=your_encryption_key_here
```

#### Admin Panel Environment (`admin-panel/.env`)
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Nefol Admin Panel
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

#### User Panel Environment (`user-panel/.env`)
```env
VITE_API_URL=http://localhost:4000
VITE_APP_NAME=Nefol Beauty
VITE_APP_VERSION=1.0.0
VITE_ENVIRONMENT=development
```

### 4. Start Development Servers

#### Option 1: Start All Services (Recommended)
```bash
# From project root
pnpm run dev:all
```

#### Option 2: Start Individual Services
```bash
# Terminal 1 - Backend API
cd backend
npm run dev

# Terminal 2 - Admin Panel
cd admin-panel
npm run dev

# Terminal 3 - User Panel
cd user-panel
npm run dev
```

### 5. Access Applications
- **Admin Panel**: http://localhost:5173
- **User Panel**: http://localhost:5174
- **API Server**: http://localhost:4000
- **API Documentation**: http://localhost:4000/api-docs

## 🔧 Configuration

### API Manager
Use the API Manager in the admin panel to configure:
- Payment gateways (Stripe, PayPal)
- Email services (SendGrid, Mailgun)
- SMS services (Twilio)
- Push notifications (Firebase)
- WhatsApp Business API
- Analytics (Google Analytics, Facebook Pixel)
- AI services (OpenAI, Anthropic)

### Feature Toggles
Enable/disable features through the configuration service:
```typescript
import configService from './services/config'

// Enable/disable specific features
configService.setFeatureEnabled('loyaltyProgram', true)
configService.setFeatureEnabled('emailMarketing', false)
```

## 📊 Database Schema

The system includes comprehensive database tables for:
- Products and inventory
- Orders and transactions
- Customers and profiles
- Loyalty programs and points
- Affiliate programs and commissions
- Email/SMS campaigns
- Analytics data
- Workflow automation
- Customer segmentation
- Journey tracking
- AI features and personalization

## 🔐 Security Features

- JWT-based authentication
- Role-based access control
- API rate limiting
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection
- Secure file uploads
- Environment variable protection

## 🚀 Deployment

### Production Build
```bash
# Build all applications
pnpm run build:all

# Or build individually
pnpm run build:admin
pnpm run build:user
pnpm run build:backend
```

### Docker Deployment
```bash
# Build Docker images
docker-compose build

# Start services
docker-compose up -d
```

## 📈 Monitoring & Analytics

- Real-time dashboard updates
- Comprehensive business metrics
- Customer journey tracking
- Conversion funnel analysis
- Actionable insights
- Performance monitoring
- Error tracking and logging

## 🤝 API Integration

### RESTful API Endpoints
- `/api/products` - Product management
- `/api/orders` - Order processing
- `/api/customers` - Customer management
- `/api/loyalty-program` - Loyalty system
- `/api/affiliate-program` - Affiliate management
- `/api/email-marketing` - Email campaigns
- `/api/sms-marketing` - SMS campaigns
- `/api/analytics` - Analytics data
- And many more...

### WebSocket Support
Real-time updates for:
- Order status changes
- Inventory updates
- Customer notifications
- Live chat messages
- Analytics updates

## 🛠️ Development

### Code Structure
- **Services**: API, authentication, configuration, error handling
- **Components**: Reusable UI components
- **Contexts**: React context for state management
- **Types**: TypeScript type definitions
- **Utils**: Utility functions and helpers

### Best Practices
- TypeScript for type safety
- Component-based architecture
- Service-oriented design
- Error handling and logging
- Responsive design
- Accessibility compliance
- Performance optimization

## 📞 Support

For technical support or questions:
- Check the API documentation at `/api-docs`
- Review the error logs in the admin panel
- Use the built-in error tracking system
- Check the configuration settings

## 🔄 Updates & Maintenance

- Regular security updates
- Feature enhancements
- Performance optimizations
- Bug fixes and improvements
- Database schema updates
- API versioning

---

**Built with ❤️ for Nefol Beauty Brand**

*This system provides a complete e-commerce solution with advanced customer engagement features, analytics, and management tools.*




