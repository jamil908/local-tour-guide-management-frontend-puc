# 🗺️ LocalGuide Platform - Frontend

A modern and responsive web application for connecting travelers with local tour guides and discovering authentic local experiences.

## 🚀 Live Demo

**Production:** https://local-guide-frontend-orcin.vercel.app/

## ✨ Features

### For Tourists

* Browse and search available tours
* Explore tours by location, category, and price
* View tour details and guide information
* Book tours with local guides
* Complete online payment
* View booking history
* Submit reviews and ratings

### For Guides

* Create and manage tour listings
* Add tour information and images
* Manage booking requests
* Accept or decline bookings
* Manage guide-related information

### For Admins

* Manage users
* Manage tour listings
* Monitor bookings
* View system information through the admin dashboard

## 🛠️ Technology Stack

* **Framework:** Next.js
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios
* **Form Handling:** React Hook Form
* **Notifications:** React Hot Toast
* **Icons:** React Icons
* **Date Handling:** date-fns

## 📦 Installation

### Prerequisites

* Node.js 18 or higher
* npm
* Backend API

### Setup

1. Clone the repository:

```bash
git clone https://github.com/jamil908/local-tour-guide-management-frontend-puc.git
cd local-tour-guide-management-frontend-puc
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env.local` file and configure the required environment variables.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=LocalGuide Platform
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application in your browser:

```text
http://localhost:3000
```

## 🎯 Main User Flows

### Tourist Flow

Home → Explore Tours → Tour Details → Book → Payment → Confirmation → Review

### Guide Flow

Register → Create Profile → Create Tour → Manage Bookings

### Admin Flow

Login → Admin Dashboard → Manage Users, Tours and Bookings

## 📁 Project Structure

```text
local-tour-guide-management-frontend-puc/
│
├── app/
│   ├── auth/
│   │   └── register/
│   ├── dashboard/
│   │   └── admin/
│   ├── explore/
│   ├── tours/
│   │   └── [id]/
│   ├── payment/
│   │   └── success/
│   └── ...
│
├── hooks/
│   └── useGetListings.ts
│
├── types/
│   └── index.ts
│
├── components/
├── contexts/
├── lib/
├── public/
└── ...
```

## 👥 Team Members & Contributions

This project was developed collaboratively by five team members.

| Team Member       | Student ID | Contribution         |
| ----------------- | ---------: | -------------------- |
| **Jamil Hossain** |   **1111** | Backend Development  |
| **Songita Dutta** |   **1092** | Frontend Development |
| **Badhon**        |   **1091** | Backend Development  |
| **Anupama**       |   **1095** | Frontend Development |
| **Arpita**        |   **1080** | Frontend Development |

### Frontend Team

* Songita Dutta — Frontend Development
* Anupama — Frontend Development
* Arpita — Frontend Development

### Backend Team

* Jamil Hossain — Backend Development
* Badhon — Backend Development

## 📱 Responsive Design

The application is designed to work across:

* Mobile devices
* Tablets
* Desktop computers

## 🧪 Testing

The frontend can be manually tested for:

* User registration
* Login and logout
* Tour exploration
* Search and filtering
* Tour details
* Tour booking
* Payment flow
* Admin dashboard
* Review functionality
* Responsive interface

## 🚀 Production Build

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## 🐛 Troubleshooting

### API Connection Error

Check that the backend server is running and the API URL in `.env.local` is correct.

### Build or Dependency Issues

Run:

```bash
npm install
npm run build
```

## 📄 License

MIT

## 👨‍💻 Project Team

**LocalGuide Development Team**

A collaborative university project developed using modern web technologies to connect travelers with local tour guides and provide an easy tour booking experience.
