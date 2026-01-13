# ServiceHive Hiring Assignment – Full Stack Project

This project is built as part of the ServiceHive hiring assignment.  
It demonstrates a complete hiring workflow with both frontend and backend deployed.

---

## 🚀 Live Demo

- **Frontend:** https://gigflow-phi.vercel.app/  
- **Backend API:** https://gigflow-platform-2n2e.onrender.com 

---

## 🧠 Features Implemented

### 👤 Authentication
- User registration & login
- JWT-based authentication
- Protected routes

### 📄 Hiring Workflow
- Create job / gig / problem (as per assignment scope)
- View listings
- Apply / bid / submit solutions
- View applicants / bids
- Status updates

### ⚡ Real-time 
- Socket.IO for live updates (bids / notifications)

### 🧩 UI
- Responsive modern UI
- Clean UX flow for hiring process

---

## 🛠 Tech Stack

### Frontend
- React.js (Vite)
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Socket.IO

### Deployment
- Frontend: Vercel 
- Backend: Render 
- Database: MongoDB Atlas

---

## 📁 Project Structure

### Frontend
client/
├─ src/
│ ├─ components/
│ ├─ pages/
│ ├─ context/
│ ├─ api/
│ └─ App.jsx


### Backend
server/
├─ controllers/
├─ routes/
├─ models/
├─ middleware/
├─ config/
└─ server.js


### Backend `.env example`

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
