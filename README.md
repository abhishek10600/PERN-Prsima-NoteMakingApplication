# 📝 Toooder – Full Stack Todo Application  

A modern, production-ready full stack Todo application built with **TypeScript** using a robust backend architecture and a clean, responsive frontend UI. Toooder allows users to securely manage todos with categories, authentication, and real-world database relationships.

> 🚀 Built to demonstrate real-world full stack development skills, clean architecture, and modern tooling.

---

## 🛠 Tech Stack  

### 🔹 Frontend  
- React 19  
- Tailwind CSS + shadcn/ui  
- React Hook Form  
- Zod (Form Validation)  
- TypeScript  

### 🔹 Backend  
- Node.js  
- Express.js  
- Prisma ORM  
- PostgreSQL  
- JSON Web Token (JWT) Authentication  
- Zod (API Validation)  
- TypeScript  

---

## ✨ Features  

- Secure Authentication & Authorization using JWT  
- User Registration & Login  
- Create, Update, Delete Todos  
- Toggle Todo Status (Completed / Pending)  
- Category Management  
  - Users can create their own categories  
  - Todos belong to user-created categories  
- Relational Database Design  
  - Users ↔ Categories ↔ Todos  
- Schema Validation using Zod  
- Clean API Architecture with Prisma ORM  
- Fully responsive UI  

---

## 🗃 Database Design  

The application uses **PostgreSQL** with relational modeling:

- Users  
- Categories (linked to users)  
- Todos (linked to both users and categories)  

Advanced relational queries and joins are handled using **Prisma ORM**, ensuring type safety and maintainable data access.

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-username/toooder.git
cd toooder

## Backend Setup
cd backend
npm install

DATABASE_URL=postgresql://user:password@localhost:5432/toooder
JWT_SECRET=your_secret_key

npx prisma migrate dev
npx prisma generate
npm run dev
```

## Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## 🔐 Authentication Flow

JWT-based authentication

Access tokens stored securely

Protected routes on both frontend & backend

Authorization middleware ensures users can only access their own todos & categories

## 🧪 Validation & Error Handling

Zod used for:

Request body validation on backend

Form validation on frontend

Centralized error handling

Clean API responses

## 🧠 What This Project Demonstrates

Real-world full stack architecture

Secure authentication & authorization

Relational database design

Type-safe backend using Prisma + TypeScript

Clean UI with reusable components

Production-level project structure

API validation and error handling

Practical use of modern React tools

## 📌 Future Improvements

Notifications & reminders

Todo analytics

Dark mode

Refresh token implementation

Unit & integration tests

## 👨‍💻 About the Developer

Hi, I’m Abhishek Sharma, a passionate Full Stack Developer who loves building scalable, real-world web applications using modern technologies.
I focus on clean code, solid architecture, and user-centric design.

If you found this project useful or interesting, consider giving it a ⭐ on GitHub — it helps a lot!

