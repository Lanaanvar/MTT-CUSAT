# 🌐 IEEE MTT-S CUSAT SB

Official website for the IEEE Microwave Theory and Techniques Society (MTT-S) CUSAT SB. The platform showcases chapter events, members, blogs, and registration for upcoming events etc...

---

## 🚀 Tech Stack

- [Next](https://nextjs.org/) – Fast frontend build tool
- [React](https://reactjs.org/) – Frontend framework
- [Tailwind CSS](https://tailwindcss.com/) or plain CSS – For styling
- [Express.js](https://expressjs.com/) – Backend API for event registration
- [MongoDB (optional)](https://www.mongodb.com/) – For storing registered data

---
## 📁 Project Structure

```
├── app/ # Next.js App Router structure
│ ├── about/ # About page
│ ├── blog/ # Blog section
│ ├── contact/ # Contact form/page
│ ├── events/ # Events + event registration
│ ├── join/ # Join us / membership section
│ ├── members/ # Execom members
│ ├── globals.css # Global CSS (tailwind base)
│ ├── layout.tsx # Root layout file
│ └── page.tsx # Homepage
│
├── components/
│ └── ui/ # Reusable UI components
│ ├── footer.tsx
│ ├── navbar.tsx
│ ├── theme-provider.tsx
│ └── upcoming-events.tsx
│
├── hooks/ # Custom React hooks
│
├── lib/ # Utilities and helpers
│ └── utils.ts
│
├── public/ # Static assets
│
├── styles/
│ └── globals.css # Extra styles if any
```
---

## ✅ Feature Checklist

- [x] Authentication(For blogs and event creation)
- [x] Homepage
- [x] Menu (Navbar)         
- [x] Footer                
- [x] Events Page           
- [x] └── Event Register
- [x] └── Event Creation (Authenticated Users Only)
- [x] Blog Section 
- [x] Blog Post Creation(Authenticated Users Only)         
- [x] Execom Members Page   
- [x] └── Member Cards      
- [x] Credits Section       
- [x] Backend Integration (Firebase) 
- [ ] Animations(Hover, onclick, onscroll etc..) 
- [ ] SEO

> Tick off items as features get implemented.

---

## 🛠 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Git

### Frontend (Client) Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/MTT-CUSAT.git
cd MTT-CUSAT

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend (Server)

```bash
cd ../server
npm install express cors
node index.js
```

---

## 🌐 Backend – Event Registration

A minimal [Express.js](https://expressjs.com/) backend is used to handle event registration.

**API Endpoints:**

* `POST /register` – Submit registration form
* `GET /registrations` – View all registrations (for testing)

> Optional: Add MongoDB or Firebase later for persistent storage.

---

## 🧪 Development Notes

* Tailwind utility classes make rapid prototyping easier. You can also use plain CSS if preferred.
* Use React Router for navigation between pages.
* Separate components and pages for clarity and reusability.

--- 
