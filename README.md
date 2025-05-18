# 🌐 IEEE MTT-S CUSAT SB

Official website for the IEEE Microwave Theory and Techniques Society (MTT-S) CUSAT SB. The platform showcases chapter events, members, blogs, and registration for upcoming events etc...

---

## 🚀 Tech Stack

- [Vite](https://vitejs.dev/) – Fast frontend build tool
- [React](https://react.dev/) – Frontend framework
- [React Router](https://reactrouter.com/) – Client-side routing
- [Tailwind CSS](https://tailwindcss.com/) or plain CSS – For styling
- [Express.js](https://expressjs.com/) – Backend API for event registration
- [MongoDB (optional)](https://www.mongodb.com/) – For storing registered data

---

## 📁 Project Structure

```bash

root/
├── client/             # React frontend (Vite)
│   ├── src/
│   │   ├── components/ # Shared components (Navbar, Footer, etc.)
│   │   ├── pages/      # Route pages (Home, Events, Blog, etc.)
│   │   └── App.jsx
│   └── index.html
└── server/             # backend for registration
└── index.js

````

---

## ✅ Feature Checklist

| Feature             | Status          |
|---------------------|-----------------|
| Homepage            | [] Not Completed |
| Menu (Navbar)       | [] Not Completed |
| Footer              | [] Not Completed |
| Events Page         | [] Not Completed |
| └── Event Register  | [] Not Completed |
| Blog Section        | [] Not Completed |
| Execom Members Page | [] Not Completed |
| └── Member Cards    | [] Not Completed |
| Credits Section     | [] Not Completed |
| Routing (React Router) | [] Not Completed |
| Tailwind / CSS Styling | [] Not Completed |
| Backend Integration | [] Not Completed |

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

The frontend will be available at `http://localhost:5173`

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