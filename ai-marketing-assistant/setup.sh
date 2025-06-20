#!/bin/bash

echo "🚀 Setting up AI Marketing Assistant..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Create necessary directories
echo "📁 Creating project directories..."
mkdir -p backend/logs
mkdir -p backend/uploads
mkdir -p frontend/admin-dashboard
mkdir -p frontend/mini-program
mkdir -p shared/types
mkdir -p shared/utils
mkdir -p docs
mkdir -p deployment

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update the .env file with your configuration values"
fi

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend/admin-dashboard
npm install

cd ../..

echo "✅ Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "1. Update backend/.env with your configuration"
echo "2. Set up your PostgreSQL database"
echo "3. Run 'npm run setup:db' to initialize the database"
echo "4. Run 'npm run dev' to start development servers"
echo ""
echo "🔗 Useful commands:"
echo "- npm run dev          # Start all development servers"
echo "- npm run dev:backend  # Start backend only"
echo "- npm run dev:frontend # Start frontend only"
echo "- npm run setup:db     # Initialize database"
echo "- npm run test         # Run tests"
echo ""
echo "📚 Documentation: README.md" 