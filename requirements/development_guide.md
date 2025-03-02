Apartment Rental Management Web Portal (MVP) Development Guide
This document provides a blueprint for building the Minimum Viable Product (MVP) of a web portal for apartment owners and tenants to manage rentals. The app will support listing apartments, managing rental offers, and facilitating tenant applications. It targets the European market with multilingual and multi-currency support.

1. Project Overview
   Objective: Build a web portal where:
   Owners can list apartments, manage rental offers (bidding or fixed-price), and generate contracts.

Tenants can browse apartments, bid or accept offers, and sign contracts.

Target: Launch in Europe, requiring multilingual support (English, German, French), multi-currency handling, and GDPR compliance.

Tech Stack:
Frontend: React with Tailwind CSS

Backend: Node.js with Express

Database: MongoDB

Deployment: Docker on AWS

Scope: Focus on core MVP features (listing, offers, basic contract generation, and messaging). Future features (e.g., payments, legal APIs) are out of scope for now.

2. Functional Requirements
   2.1 For Owners
   Register/login and manage profile.

List/edit/delete apartment listings (details: location, price, size, photos, rental mode).

Choose rental mode: bidding (tenants bid) or fixed-price (rent immediately).

Review tenant applications/bids, approve/reject, and generate a basic contract for e-signing.

Communicate with tenants via in-app messaging.

2.2 For Tenants
Register/login and manage profile.

Browse and filter apartment listings.

Apply via bidding or accept fixed-price offers.

Track application status and e-sign contracts.

Communicate with owners.

2.3 General Features
Multilingual support (English, German, French).

Multi-currency display (e.g., EUR, GBP, SEK) with daily updated rates.

Responsive design for desktop, tablet, and mobile.

Notifications (in-app and email) for key events (new bid, offer accepted).

3. Non-Functional Requirements
   Performance: Page load < 2s, API response < 500ms.

Security: HTTPS, JWT authentication, bcrypt for passwords, GDPR compliance.

Scalability: Handle 1,000 concurrent users.

Usability: Intuitive UI, WCAG 2.1 Level AA accessibility.

Database: MongoDB for flexible schema design.

4. Tech Stack and Tools
   Frontend: React, Tailwind CSS, i18next (for internationalization).

Backend: Node.js, Express, MongoDB (via Mongoose).

APIs:
Currency conversion: Open Exchange Rates API.

Email notifications: SendGrid.

File storage: AWS S3 (for photos, contracts).

Deployment: Docker containers on AWS ECS.

Other: JWT for auth, ESLint/Prettier for code quality.

5. File Structure
   Below is the suggested project structure for both frontend and backend.
   5.1 Backend (Node.js + Express)

backend/
├── src/
│ ├── config/
│ │ ├── database.js # MongoDB connection
│ │ ├── env.js # Environment variables
│ │ └── index.js # Config export
│ ├── controllers/
│ │ ├── authController.js # Login, register
│ │ ├── apartmentController.js # CRUD for apartments
│ │ ├── offerController.js # Manage rental offers
│ │ ├── contractController.js # Generate basic contracts
│ │ └── messageController.js # In-app messaging
│ ├── middleware/
│ │ ├── auth.js # JWT middleware
│ │ └── error.js # Error handling
│ ├── models/
│ │ ├── User.js # User schema (owner/tenant)
│ │ ├── Apartment.js # Apartment schema
│ │ ├── Offer.js # Rental offer schema
│ │ ├── Contract.js # Contract schema
│ │ └── Message.js # Message schema
│ ├── routes/
│ │ ├── authRoutes.js # /api/auth
│ │ ├── apartmentRoutes.js # /api/apartments
│ │ ├── offerRoutes.js # /api/offers
│ │ ├── contractRoutes.js # /api/contracts
│ │ └── messageRoutes.js # /api/messages
│ ├── services/
│ │ ├── currencyService.js # Currency conversion
│ │ ├── emailService.js # SendGrid integration
│ │ └── s3Service.js # AWS S3 for file storage
│ └── app.js # Express app setup
├── .env # Environment variables
├── Dockerfile # Docker setup
└── package.json # Dependencies

5.2 Frontend (React)

frontend/
├── public/
│ ├── index.html # Main HTML
│ └── locales/ # Translation files (en, de, fr)
│ ├── en.json
│ ├── de.json
│ └── fr.json
├── src/
│ ├── assets/ # Images, icons
│ ├── components/
│ │ ├── Auth/
│ │ │ ├── Login.js
│ │ │ └── Register.js
│ │ ├── Apartment/
│ │ │ ├── ListingCard.js # Display apartment
│ │ │ ├── ListingForm.js # Add/edit listing
│ │ │ └── ListingDetail.js # Detailed view
│ │ ├── Offer/
│ │ │ ├── BidForm.js # Tenant bid form
│ │ │ └── OfferStatus.js # Offer status tracking
│ │ ├── Contract/
│ │ │ └── ContractView.js # View/sign contract
│ │ └── Message/
│ │ ├── ChatWindow.js # In-app messaging
│ │ └── Notification.js # Display notifications
│ ├── pages/
│ │ ├── Home.js # Landing page
│ │ ├── Profile.js # User profile
│ │ ├── Listings.js # Browse apartments
│ │ └── Dashboard.js # Owner dashboard
│ ├── context/
│ │ ├── AuthContext.js # User auth state
│ │ └── LanguageContext.js # Language state
│ ├── utils/
│ │ ├── api.js # API fetch wrapper
│ │ └── formatCurrency.js # Currency formatting
│ ├── App.js # Main app component
│ └── index.js # Entry point
├── .env # Environment variables
├── Dockerfile # Docker setup
└── package.json # Dependencies

6. Database Schema (MongoDB)
   6.1 Collections
   Users
   json

{
\_id: ObjectId,
role: String ("owner" | "tenant"),
email: String,
password: String (hashed),
name: String,
phone: String,
language: String ("en" | "de" | "fr"),
currency: String ("EUR" | "GBP" | "SEK"),
createdAt: Date
}

Apartments
json

{
\_id: ObjectId,
ownerId: ObjectId,
title: String,
description: String,
address: String,
price: Number,
size: Number,
rooms: Number,
amenities: [String],
photos: [String], // URLs to S3
rentalMode: String ("bidding" | "fixed"),
available: Boolean,
createdAt: Date
}

Offers
json

{
\_id: ObjectId,
apartmentId: ObjectId,
tenantId: ObjectId,
bidAmount: Number (optional),
status: String ("pending" | "accepted" | "rejected"),
createdAt: Date
}

Contracts
json

{
\_id: ObjectId,
apartmentId: ObjectId,
ownerId: ObjectId,
tenantId: ObjectId,
terms: String,
price: Number,
status: String ("draft" | "signed"),
fileUrl: String, // URL to S3
createdAt: Date
}

Messages
json

{
\_id: ObjectId,
senderId: ObjectId,
receiverId: ObjectId,
content: String,
read: Boolean,
createdAt: Date
}

7. API Endpoints
   7.1 Auth
   POST /api/auth/register - Register user.

POST /api/auth/login - Login and return JWT.

GET /api/auth/profile - Get user profile (protected).

7.2 Apartments
POST /api/apartments - Create listing (owner).

GET /api/apartments - List all apartments.

GET /api/apartments/:id - Get apartment details.

PUT /api/apartments/:id - Update listing (owner).

DELETE /api/apartments/:id - Delete listing (owner).

7.3 Offers
POST /api/offers - Submit bid/accept offer (tenant).

GET /api/offers/apartment/:id - List offers for apartment (owner).

PUT /api/offers/:id - Approve/reject offer (owner).

7.4 Contracts
POST /api/contracts - Generate contract (owner).

GET /api/contracts/:id - View contract.

PUT /api/contracts/:id/sign - Sign contract (tenant).

7.5 Messages
POST /api/messages - Send message.

GET /api/messages/:userId - Get messages for user.

8. Development Steps
   Phase 1: Setup and Backend Core (1-2 weeks)
   Environment Setup:
   Initialize Node.js project (npm init).

Install dependencies (express, mongoose, jsonwebtoken, bcrypt, dotenv).

Set up MongoDB locally or on MongoDB Atlas.

Configure .env for API keys (AWS S3, SendGrid, Open Exchange Rates).

Database:
Define Mongoose models as per schema above.

Seed initial data (e.g., test users, apartments).

Auth:
Implement authController.js for registration/login.

Add JWT middleware in auth.js.

Core APIs:
Build apartment CRUD endpoints.

Implement offer submission and management.

Set up basic messaging system.

Phase 2: Frontend Core (1-2 weeks)
Setup:
Create React app (npx create-react-app).

Install dependencies (axios, tailwindcss, i18next, react-router-dom).

Set up Tailwind CSS and i18next for translations.

Auth Pages:
Build Login.js and Register.js.

Create AuthContext.js for managing user state.

Apartment Listings:
Build Listings.js for browsing.

Create ListingForm.js for adding/editing.

Implement ListingDetail.js for detailed views.

Offers and Contracts:
Build BidForm.js and OfferStatus.js.

Create ContractView.js for viewing/signing.

Phase 3: Integration and Features (1 week)
Messaging: Add ChatWindow.js and Notification.js.

Internationalization:
Set up locales/ with translation files.

Add language switcher in LanguageContext.js.

Currency:
Fetch rates via Open Exchange Rates API in currencyService.js.

Display prices in user-selected currency.

File Storage:
Integrate AWS S3 for photo/contract uploads in s3Service.js.

Phase 4: Testing and Deployment (1 week)
Testing:
Unit tests for backend (jest).

Manual testing for frontend UI/UX.

Docker:
Write Dockerfile for backend and frontend.

Test locally with docker-compose.

Deploy:
Deploy MongoDB on Atlas.

Deploy backend/frontend to AWS ECS via Docker.

Set up HTTPS with AWS CloudFront.

9. Future Enhancements (Post-MVP)
   Add payment handling (bill splitting, late payment tracking).

Integrate legal APIs for debt collection.

Implement risk assessment for tenants (payment probability).

Build mobile apps (iOS/Android).

Add analytics dashboards for owners.

10. Notes for Cursor Coder
    Use this .md as a reference for generating code snippets.

Focus on modular components (e.g., separate API routes, reusable React components).

Prioritize security (JWT, HTTPS, GDPR) and performance (index MongoDB fields).

For multilingual support, ensure all static text is in translation files (locales/).

Test APIs with Postman during development.
