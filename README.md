# HealthScope AI

**Health Risk Assessment Using AI - Complete Health Management Platform**

A comprehensive health management application built with React, TypeScript, and Supabase, featuring AI-powered health analysis, family health tracking, and nutrition management.

## 🚀 Features

### Core Health Management
- **Family Health Dashboard** - Track health data for multiple family members
- **Health Report Analysis** - AI-powered analysis of uploaded health reports
- **Risk Assessment** - Comprehensive health risk evaluation
- **Nutrition Tracking** - Barcode scanning and food analysis
- **AI Chat Support** - Personalized health advice and guidance

### Technical Features
- **Modern UI/UX** - Built with shadcn/ui and Tailwind CSS
- **Real-time Data** - Supabase real-time database integration
- **AI Integration** - OpenAI GPT-4 for health analysis and chat
- **Barcode Scanning** - Nutrition data lookup via barcode
- **Responsive Design** - Mobile-first approach
- **Secure Authentication** - Supabase Auth with RLS policies

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions)
- **AI Services**: OpenAI GPT-4, Nutritionix API
- **State Management**: React Context API
- **Routing**: React Router DOM

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- OpenAI API key


### Supabase Setup

1. **Create a new Supabase project**
2. **Run the database migration**:
   ```sql
   -- Copy and run the content from migration-complete-schema.sql
   ```
3. **Deploy Edge Functions**:
   - `chat` - AI chat functionality
   - `analyze-food` - Food nutrition analysis
   - `analyze-health-report` - Health report analysis
4. **Set environment variables** in Supabase:
   - `OPENAI_API_KEY` - Your OpenAI API key
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon key

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── BarcodeScanner.tsx
│   ├── ChatBot.tsx
│   └── ...
├── pages/              # Application pages
│   ├── Dashboard.tsx
│   ├── FamilyDashboard.tsx
│   ├── Reports.tsx
│   └── ...
├── contexts/           # React contexts
│   ├── AuthContext.tsx
│   └── HealthContext.tsx
├── integrations/       # External service integrations
│   └── supabase/
└── lib/               # Utility functions

supabase/
├── functions/         # Edge Functions
│   ├── chat/
│   ├── analyze-food/
│   └── analyze-health-report/
├── migrations/        # Database migrations
└── config.toml       # Supabase configuration
```

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Supabase Edge Functions

The application uses three Edge Functions:

1. **Chat Function** - Handles AI chat interactions
2. **Analyze Food Function** - Processes nutrition data
3. **Analyze Health Report Function** - Analyzes health reports

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms

The app can be deployed to any platform that supports React applications:
- Netlify
- GitHub Pages
- AWS Amplify
- Railway

## 📱 Usage

1. **Sign Up/Login** - Create an account or sign in
2. **Add Family Members** - Set up profiles for family members
3. **Upload Health Reports** - Upload and analyze health documents
4. **Track Nutrition** - Scan barcodes or manually enter food data
5. **Get AI Insights** - Chat with AI for health advice
6. **Monitor Progress** - View analytics and health trends

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) for backend infrastructure
- [OpenAI](https://openai.com/) for AI capabilities
- [Nutritionix](https://www.nutritionix.com/) for nutrition data
- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [Tailwind CSS](https://tailwindcss.com/) for styling


---

**Built with ❤️ for better health management**
