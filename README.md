
# 🌐 Social Media Web App

A full-stack **Social Media Platform** built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) that allows users to register, login, create posts, like/dislike content, and connect with others.

---

## 🚀 Tech Stack

| Frontend | Backend | Database | Tools |
|----------|---------|----------|-------|
| React.js | Node.js + Express.js | MongoDB | JWT, Axios, TailwindCSS, Toastify |

---

## ✨ Features

- 👤 User Registration & Login with JWT Authentication
- 🔒 Protected Routes
- 📝 Create, Edit, Delete Posts
- ❤️ Like / Dislike Posts
- 💬 Comment System
- 🔍 View User Profiles
- 🧾 Responsive UI with TailwindCSS
- 🔔 Toast Notifications (react-toastify)
- 🌐 API Integration with Axios

---

## 🖼️ Demo Screenshots

> _(You can add your app screenshots here)_

---

## 📁 Folder Structure

```
/social-media-app
├── client        # React Frontend
│   ├── src
│   ├── public
│   └── ...
├── server        # Express Backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   └── ...
└── README.md
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/atharvawagh123/myhub
cd social-media-app
```

### 2. Setup Backend

```bash
cd server
npm install
```

- Create `.env` file inside `server/` folder:

```env
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret_key
```

- Start the backend server:

```bash
npm run dev
```

---

### 3. Setup Frontend

```bash
cd client
npm install
```

- Create `.env` file inside `client/` folder:

```env
REACT_APP_API_URL=http://localhost:5000/
```

- Start the React app:

```bash
npm start
```

---

## ✅ To Do (Future Enhancements)

- [ ] 🔐 Forgot Password / Reset Flow
- [ ] 📦 Image Uploads via Cloudinary
- [ ] 🔔 Push Notifications


---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

## 🤝 Connect with Me

- 🔗 [LinkedIn](https://www.linkedin.com/in/atharvawagh2005/)
- 💼 Portfolio: [portfolio website](https://portfolio-ai34.onrender.com/)
- 📧 Email: watharva383@gmail.com
