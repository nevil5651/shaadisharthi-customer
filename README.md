# ShaadiSharthi – Customer Frontend  

This repository contains the **Customer-side frontend** of the **ShaadiSharthi** wedding services platform.  
Customers can explore vendors, filter services, book them, and manage their bookings through a personalized dashboard.  

> ⚠️ Note: This repo only contains the **Customer Frontend** (Next.js + TypeScript + Tailwind CSS).  
> The platform also has:  
> - **Admin frontend** (separate repo)  
> - **Service Provider frontend** (separate repo)  
> - **Java Backend** (separate repo, built with Servlets)  

---

## 🚀 Tech Stack  

- **Framework**: [Next.js](https://nextjs.org/)  
- **Language**: TypeScript  
- **Styling**: Tailwind CSS  
- **Backend**: Java (Servlets, REST APIs)  
- **Auth**: JWT + HttpOnly Cookies + Caching (`api/auth/me`)  
- **Database**: MySQL  
- **Email Service**: SMTP (triggered by backend events)  

---

## 🎯 Features  

### 🌐 Landing Page  
- Wedding-themed landing page with:  
  - About Us, Services overview, Testimonials, Contact Info.  

### 🔐 Authentication  
- Customer **Login** with email & password.  
- **JWT** used for authentication, stored in HttpOnly cookies.  
- **Register Now** → email verification with token (15-min expiry).  
- **Forgot Password** → reset password via backend.  
- Social login buttons (Google, Facebook) displayed but not functional yet.  

### 📊 Customer Dashboard  
- Shows **upcoming bookings** upto 3 services and Count of Total Upcoming Services is Shown on the card above.  
- Displays **recommended services** (currently popular services).

### 🛍 Services & Vendors  
- Browse all services offered by providers.  
- Service card includes:  
  - Name, location, rating & total reviews.  
  - Starting price (flexible).  
  - **View button** → Detailed service page.  

#### 🔎 Service Filters  
- Filter by category, location, price range, and rating.  
- Sort by most popular, highest rated, price (low→high, high→low).  
- Reset filter option.  
- **Browse by Category** shortcut for quick access.  

#### 📄 Service Details Page  
- Business name, description, and media gallery (photos/videos).  
- Reviews with infinite scroll + option to write review.  
- Pricing card (contact info + price).
- **Book Now** → booking form.  

### 📅 Booking Flow  
- Booking form collects:  
  - Service name, provider name, price (editable),  
  - Customer details (name, phone, venue, date, time, requirements).  
- On confirmation:  
  - Email sent to provider via backend.  
  - Booking added to **My Bookings**.  

#### 📌 Booking Lifecycle  
- **Pending** → initial state after booking.  
- **Confirmed** → provider accepts.  
- **Cancelled** → provider rejects or customer cancels.  
- **Completed** → provider marks completed (after service date).  

#### 🔎 Booking Management  
- Search bookings by keyword or date range.  
- Filter by status (Pending / Confirmed / Cancelled / Completed).  
- Cancel option for Pending or Confirmed bookings.  
- Pagination (e.g., 1/16 → next).  

### 👤 My Profile  
- Shows name, email (not editable), member since, join date.  
- Edit profile (name, phone number, address).  
- Change password & 2FA (not yet implemented).  
- Recent activity (static).  
- Delete account (not yet implemented).  
- Logout (fully working).  

### 📑 Pagination  
- **Services listing** → infinite scroll (12 at a time).  
- **Bookings** → page-based (manual navigation).  

---

## ⚙️ Getting Started  

### 1. Clone the repo  
```bash
git clone https://github.com/your-username/shaadisharthi-customer.git
cd shaadisharthi-customer

### 2. Install dependencies
npm install

### 3.Create .env file at Root of Project
NEXT_PUBLIC_API_URL=http://localhost:8080/api

### 4.Run development server
npm run dev




