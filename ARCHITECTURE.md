# Swasthya Sakha Architecture

## Frontend
- React 18 + Vite
- Tailwind CSS
- Redux Toolkit + React Redux
- React Router
- Leaflet / React Leaflet
- Reusable components: Sidebar, Topbar, StatCard, SectionHeader, Modal, Badge, FacilityMap

## Backend
- Node.js + Express
- JWT authentication for the prototype API
- bcryptjs password hashing for demo users
- Mongoose for MongoDB
- Appointment REST endpoints

## State model
- `auth`: authenticated user + JWT
- `ui`: sidebar/toast state
- `health`: facility, medicine, diagnostic and appointment datasets

## Role model
Patient / Health Worker / Doctor / Facility Admin / District Admin.

The frontend currently uses seeded demo data for the dashboards so it remains useful without a populated database. The API is ready to replace those datasets with MongoDB-backed resources.
