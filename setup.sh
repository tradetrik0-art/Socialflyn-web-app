#!/bin/bash
# Socialflyn — Quick Setup Script
# This script will help you get Socialflyn running in minutes

set -e

echo "🚀 Welcome to Socialflyn Setup"
echo "================================"
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install from https://nodejs.org"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js"
    exit 1
fi

NODE_VERSION=$(node -v)
echo "✅ Node.js ${NODE_VERSION}"

if ! command -v psql &> /dev/null; then
    echo "⚠️  PostgreSQL client not found. Make sure PostgreSQL server is running."
fi

echo ""
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps
echo "✅ Dependencies installed"

echo ""
echo "⚙️  Setting up environment..."

if [ ! -f "apps/backend/.env" ]; then
    cp apps/backend/.env.example apps/backend/.env
    echo "✅ Created apps/backend/.env"
    echo "   → Please edit with your API keys (OPENAI_API_KEY, SENDGRID_API_KEY, etc.)"
fi

if [ ! -f "apps/frontend/.env" ]; then
    cp apps/frontend/.env.example apps/frontend/.env
    echo "✅ Created apps/frontend/.env"
fi

echo ""
echo "🗄️  Setting up database..."
cd apps/backend

if command -v npm &> /dev/null; then
    npm run db:generate
    echo "✅ Prisma client generated"
    
    npm run db:migrate
    echo "✅ Database migrations completed"
    
    echo ""
    echo "Would you like to seed sample data? (y/n)"
    read -r SEED
    if [ "$SEED" = "y" ]; then
        npm run db:seed
        echo "✅ Sample data loaded"
    fi
fi

cd ../..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Edit your environment files:"
echo "   - apps/backend/.env (add API keys)"
echo "   - apps/frontend/.env (add APP_URL)"
echo ""
echo "2. Start development:"
echo "   npm run dev"
echo ""
echo "3. Open browser:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend: http://localhost:3001"
echo ""
echo "4. Documentation:"
echo "   - Quick Start: ./QUICK_START.md"
echo "   - Development: ./DEVELOPMENT.md"
echo "   - API Docs: ./apps/backend/docs/API.md"
echo ""
echo "Happy coding! 🚀"
