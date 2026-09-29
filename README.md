# 🗺️ LocalGuide Platform - Frontend

Modern, responsive web application for connecting travelers with local tour guides.

## 🚀 Live Demo
**Production:** https://local-guide-frontend-orcin.vercel.app/
**Backend API:** https://your-backend.onrender.com

## 🎥 Video Demo
[Watch Full Demo (English)](https://drive.google.com/your-video-link)

## ✨ Features

### For Tourists
- 🔍 Browse and search tours by location, category, and price
- 📅 Book tours with local guides
- 💳 Secure payment via SSLCommerz
- ⭐ Write and edit reviews
- 📊 View booking history

### For Guides
- ➕ Create and manage tour listings
- 🖼️ Upload tour images
- 📋 Manage bookings
- ✅ Accept or decline booking requests
- 📈 View earnings and statistics

### For Admins
- 👥 User management
- 🗺️ Listing moderation
- 📊 View all bookings and statistics

## 🛠️ Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context API
- **HTTP Client:** Axios
- **Form Handling:** React Hook Form
- **Notifications:** React Hot Toast
- **Icons:** React Icons
- **Date Handling:** date-fns

## 📦 Installation

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Backend API running

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/localguide-frontend.git
cd localguide-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=LocalGuide Platform
```

4. **Start Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🎨 Key Features Walkthrough

### Home Page (7+ Sections)
1. **Hero Section** - Search bar and call-to-action
2. **How It Works** - 3-step process explanation
3. **Categories** - Popular tour categories
4. **Featured Destinations** - Top cities with guide count
5. **Why Choose Us** - Platform benefits
6. **Testimonials** - User reviews
7. **Become a Guide CTA** - Guide recruitment section

### Tour Discovery
- Advanced search with filters
- Real-time search results
- Category-based filtering
- Price range filters
- City-based search

### Booking Flow
1. Select tour and date
2. Choose number of people
3. View price breakdown
4. Create booking
5. Complete payment via SSLCommerz
6. Receive confirmation

### Review System
- Write reviews after tour completion
- 5-star rating system
- Edit and delete own reviews
- View all reviews on tour page

## 📁 Project Structure
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/
│   │   ├── tourist/
│   │   ├── guide/
│   │   └── admin/
│   ├── explore/
│   ├── tours/[id]/
│   ├── profile/[id]/
│   ├── payment/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   ├── ImageUpload.tsx
│   │   ├── ReviewModal.tsx
│   │   └── PaymentButton.tsx
│   └── shared/
│       ├── Navbar.tsx
│       ├── Footer.tsx
│       └── Loading.tsx
├── contexts/
│   └── AuthContext.tsx
├── lib/
│   ├── api.ts              # Axios configuration
│   ├── auth.ts             # Auth helpers
│   └── utils.ts            # Utility functions
├── types/
│   └── index.ts            # TypeScript types
├── public/
├── .env.local.example
└── package.json
```

## 🎯 User Flows

### Tourist Journey
```
Home → Explore Tours → Tour Details → Book → Pay → Confirm → Review
```

### Guide Journey
```
Register → Complete Profile → Create Listing → Manage Bookings → Earn
```

### Admin Journey
```
Login → Dashboard → Manage Users/Listings/Bookings
```

## 🚀 Build & Deploy

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy to Render
See [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🔐 Test Accounts

### Admin
- Email: `admin@localguide.com`
- Password: `admin123`

### Tourist
- Email: `tourist@test.com`
- Password: `tourist123`

### Guide
- Email: `guide@test.com`
- Password: `guide123`

## 🎨 Design System

### Colors
- Primary: Blue (#2563eb)
- Secondary: Purple (#7c3aed)
- Success: Green (#10b981)
- Warning: Yellow (#f59e0b)
- Error: Red (#ef4444)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, varying sizes
- Body: Regular, 16px base

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration (Tourist, Guide)
- [ ] Login/Logout functionality
- [ ] Create tour listing (Guide)
- [ ] Search and filter tours
- [ ] Book a tour
- [ ] Complete payment
- [ ] Write/Edit/Delete review
- [ ] Admin panel access

## 📱 Responsive Design
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## 🐛 Troubleshooting

### API Connection Error
Check if backend is running and `NEXT_PUBLIC_API_URL` is correct.

### Build Errors
```bash
rm -rf .next node_modules
npm install
npm run build
```

### Type Errors
```bash
npm run type-check
```

## 📄 License
MIT

## 👨‍💻 Author
**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com
- Portfolio: https://yourportfoli