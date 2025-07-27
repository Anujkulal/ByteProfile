# ByteProfile - AI-powered resume builder

A modern, AI-powered resume builder that helps you create professional resumes with ease. Built with Next.js 15, TypeScript, and integrated with GitHub for seamless data import.

## ✨ Features

### 🤖 AI-Powered Content Generation

- **Smart Summary Generation**: AI analyzes your experience and generates compelling professional summaries
- **Content Optimization**: Leverages OpenAI to create tailored content based on your background

### 🔗 GitHub Integration

- **One-Click Import**: Connect your GitHub profile to automatically populate your resume
- **Project Showcase**: Automatically imports your top repositories as projects
- **Profile Data Sync**: Pulls name, location, bio, and contact information

### 🎨 Professional Templates

- **Modern Design**: Clean, ATS-friendly resume templates
- **Customizable Styling**: Adjust colors, fonts, and layout to match your brand
- **Print-Ready**: Optimized for printing

### 💾 Smart Auto-Save

- **Real-time Saving**: Your changes are automatically saved as you type
- **Version Control**: Never lose your progress with intelligent auto-save

### 🔐 Secure Authentication

- **Clerk Integration**: Secure user authentication and management
- **Privacy First**: Your data is protected and encrypted
- **Multi-Provider**: Support for multiple sign-in methods (email, google and github)

## 🚀 Tech Stack

### Frontend

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Modern UI components
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation

### Backend

- **Prisma** - Type-safe database ORM
- **PostgreSQL** - Robust relational database
- **Vercel Blob** - File storage for images
- **Server Actions** - Modern server-side logic

### AI & Integrations

- **GitHub API** - Profile and repository data import
- **OpenAI API** - AI-powered content generation **(MistralAI)**
- **Clerk** - Authentication and user management

## 🛠️ Installation

### Prerequisites

- Node.js 18+
- npm
- PostgreSQL database
- GitHub account (for GitHub integration)

### 1. Clone the repository

```bash
git clone git@github.com:Anujkulal/ByteProfile.git
cd ByteProfile
```

### 2. Install dependencies

```bash
npm i
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=
DATABASE_URL_UNPOOLED=
PGHOST=
PGHOST_UNPOOLED=
PGUSER=
POSTGRES_USER=
PGDATABASE=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NO_SSL=
NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY=
NEXT_PUBLIC_STACK_PROJECT_ID=
STACK_SECRET_SERVER_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/signin"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/signup"
PGPASSWORD=
POSTGRES_URL_NON_POOLING=
POSTGRES_URL=
OPENROUTER_API_KEY=
BLOB_READ_WRITE_TOKEN=
NEXTAUTH_URL=
GITHUB_TOKEN=
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.
