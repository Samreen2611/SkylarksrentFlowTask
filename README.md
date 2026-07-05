# RentFlow 🏠

**RentFlow** is a complete property & rent management mobile application built with React Native CLI and Firebase. It helps landlords manage their properties, units, tenants, rental agreements, and rent payments — all in one place.

Developed as part of a React Native internship project at **Skylarks IT Solution**.

## 👩‍💻 Developed By

**Samreen**
Software Engineering Student, COMSATS University Islamabad (Attock Campus)

## ✨ Features

- 🔐 **Authentication** — Email/password register, login, and session persistence via Firebase Auth
- 🏢 **Properties Management** — Add, view, and manage multiple properties (shops, flats, houses, offices, warehouses)
- 🚪 **Units Management** — Track individual units within each property with live status (Vacant / Occupied / Maintenance)
- 👥 **Tenants Management** — Maintain tenant records with contact details
- 📝 **Rental Agreements** — Create agreements linking a tenant to a unit; automatically updates unit status using Firestore transactions
- 💵 **Rent Records** — Generate monthly rent records per agreement with duplicate prevention
- 💳 **Payments** — Record full or partial payments with automatic status calculation (Unpaid / Partial / Paid / Overdue), powered by Firestore transactions
- 📊 **Dashboard** — Real-time overview of properties, units, monthly collections, and pending/overdue rent
- 📈 **Reports** — Monthly rent summary, property-wise income, tenant ledger, expense tracking, and profit/loss report
- 🔎 **Filters** — Filter rent records by month, year, and payment status
- 🔔 **Toast Notifications** — Clean success/error feedback across the app

## 🛠️ Tech Stack

- **React Native CLI** (TypeScript)
- **Firebase** — Authentication & Cloud Firestore
- **React Navigation** — Bottom Tabs + Native Stack
- **Firestore Transactions** — for atomic agreement and payment updates
- **React Native Vector Icons**, **Toast Message**

## 📱 Core Data Model

The app uses the following Firestore collections, each scoped to the owner (`ownerId`) for multi-user data isolation:

`users`, `properties`, `units`, `tenants`, `agreements`, `rent_records`, `rent_payments`, `expenses`

## 🚀 Getting Started

```bash
npm install
npx react-native run-android
```

Requires a Firebase project with Authentication (Email/Password) and Firestore enabled, and `google-services.json` placed in `android/app/`.

## 📌 Project Status

MVP complete — Auth, Properties, Units, Tenants, Agreements, Rent Records, Payments, Dashboard, and Reports are fully functional.

---

*Built with dedication as part of an internship learning journey in React Native and Firebase.*