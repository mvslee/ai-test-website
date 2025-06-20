# 🚀 AI Marketing Assistant - Development Guide

## 📋 **Project Overview**

This is a comprehensive marketing automation platform that helps brands and local businesses create, manage, and distribute content across multiple social media platforms including Xiaohongshu, WeChat Moments, Dianping, and Weibo.

## 🏗️ **Architecture**

### **Backend (Node.js + TypeScript + Express)**
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based with role-based access
- **File Upload**: Multer with image processing
- **Social Media APIs**: Integration with Chinese platforms
- **Analytics**: Real-time tracking and reporting

### **Frontend (React + TypeScript + Ant Design)**
- **Admin Dashboard**: Campaign management interface
- **WeChat Mini Program**: User-facing landing page
- **State Management**: Redux Toolkit
- **UI Framework**: Ant Design

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL 14+
- Redis 6+ (optional for caching)
- Git

### **1. Clone and Setup**
```bash
# Clone the repository
git clone <repository-url>
cd ai-marketing-assistant

# Make setup script executable
chmod +x setup.sh

# Run setup script
./setup.sh
```

### **2. Database Setup**
```bash
# Install PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# Create database
createdb ai_marketing

# Or use Docker
docker run --name postgres-ai-marketing \
  -e POSTGRES_DB=ai_marketing \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:14
```

### **3. Environment Configuration**
```bash
# Copy environment template
cp backend/env.example backend/.env

# Edit the .env file with your configuration
nano backend/.env
```

**Required Environment Variables:**
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ai_marketing"

# JWT
JWT_SECRET="your-super-secret-jwt-key"

# Server
PORT=3001
FRONTEND_URL="http://localhost:3000"

# WeChat (for Mini Program)
WECHAT_APP_ID="your-wechat-app-id"
WECHAT_APP_SECRET="your-wechat-app-secret"
```

### **4. Initialize Database**
```bash
# Generate Prisma client
cd backend
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed initial data (optional)
npx prisma db seed
```

### **5. Start Development Servers**
```bash
# Start both backend and frontend
npm run dev

# Or start individually
npm run dev:backend  # Backend on port 3001
npm run dev:frontend # Frontend on port 3000
```

## 📁 **Project Structure**

```
ai-marketing-assistant/
├── backend/                    # Backend API server
│   ├── src/
│   │   ├── controllers/        # Request handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── utils/             # Utility functions
│   │   └── index.ts           # Server entry point
│   ├── prisma/                # Database schema and migrations
│   ├── uploads/               # File uploads
│   └── logs/                  # Application logs
├── frontend/
│   ├── admin-dashboard/       # React admin interface
│   │   ├── src/
│   │   │   ├── components/    # Reusable components
│   │   │   ├── pages/         # Page components
│   │   │   ├── contexts/      # React contexts
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── services/      # API services
│   │   │   └── store/         # Redux store
│   │   └── public/            # Static assets
│   └── mini-program/          # WeChat Mini Program
├── shared/                    # Shared utilities and types
├── docs/                      # Documentation
└── deployment/                # Deployment configurations
```

## 🔧 **Development Workflow**

### **Backend Development**
```bash
cd backend

# Install dependencies
npm install

# Start development server with hot reload
npm run dev

# Run tests
npm test

# Lint code
npm run lint

# Format code
npm run lint:fix
```

### **Frontend Development**
```bash
cd frontend/admin-dashboard

# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

### **Database Management**
```bash
cd backend

# View database in browser
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Generate Prisma client
npx prisma generate
```

## 🧪 **Testing**

### **Backend Tests**
```bash
cd backend

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Frontend Tests**
```bash
cd frontend/admin-dashboard

# Run tests
npm test

# Run tests in watch mode
npm test -- --watch
```

## 📊 **API Documentation**

### **Authentication Endpoints**
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### **Campaign Endpoints**
- `GET /api/campaigns` - List campaigns
- `POST /api/campaigns` - Create campaign
- `GET /api/campaigns/:id` - Get campaign details
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Delete campaign
- `POST /api/campaigns/:id/publish` - Publish campaign
- `POST /api/campaigns/:id/pause` - Pause campaign

### **Content Endpoints**
- `GET /api/content` - List content
- `POST /api/content` - Create content
- `PUT /api/content/:id` - Update content
- `DELETE /api/content/:id` - Delete content

### **Analytics Endpoints**
- `GET /api/analytics` - Get analytics data
- `GET /api/analytics/campaign/:id` - Get campaign analytics

## 🔐 **Authentication & Authorization**

### **User Roles**
- **SUPER_ADMIN**: Full system access
- **ADMIN**: Campaign and content management
- **OPERATOR**: Content creation and publishing
- **VIEWER**: Read-only access

### **JWT Token Structure**
```json
{
  "userId": "user_id",
  "email": "user@example.com",
  "role": "ADMIN",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 📱 **WeChat Mini Program**

### **Setup**
1. Register WeChat Mini Program account
2. Configure AppID and AppSecret in environment
3. Set up server domain in WeChat developer console
4. Implement WeChat login flow

### **Features**
- User authentication via WeChat
- Campaign landing pages
- Content generation interface
- One-click social media publishing
- Reward system integration

## 🚀 **Deployment**

### **Development**
```bash
# Start all services
npm run dev
```

### **Production**
```bash
# Build all applications
npm run build

# Start production server
npm start
```

### **Docker Deployment**
```bash
# Build Docker images
npm run docker:build

# Start containers
npm run docker:up

# Stop containers
npm run docker:down
```

## 🔍 **Debugging**

### **Backend Debugging**
```bash
# Enable debug logging
DEBUG=* npm run dev

# View logs
tail -f backend/logs/combined.log
```

### **Frontend Debugging**
- Use React Developer Tools
- Check browser console for errors
- Use Redux DevTools for state inspection

### **Database Debugging**
```bash
# Open Prisma Studio
npx prisma studio

# Check database connection
npx prisma db pull
```

## 📈 **Performance Optimization**

### **Backend**
- Implement Redis caching
- Use database indexing
- Optimize database queries
- Implement rate limiting

### **Frontend**
- Code splitting with React.lazy()
- Optimize bundle size
- Implement virtual scrolling for large lists
- Use React.memo() for expensive components

## 🔒 **Security Considerations**

### **Data Protection**
- Encrypt sensitive data
- Implement input validation
- Use HTTPS in production
- Regular security audits

### **API Security**
- Rate limiting
- CORS configuration
- JWT token expiration
- Input sanitization

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📞 **Support**

- **Documentation**: Check the docs/ folder
- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub Discussions for questions
- **Email**: support@ai-marketing-assistant.com

---

**Happy coding! 🎉** 