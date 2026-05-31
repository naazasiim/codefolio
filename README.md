# CodeFolio 🚀

**CodeFolio** is a full-stack developer portfolio and recruitment discovery platform. It allows developers to showcase their technical skills and projects, while providing recruiters with a seamless way to discover and view developer profiles.

---

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **Authentication:** JWT (JSON Web Tokens), bcryptjs
* **Email Service:** Nodemailer (with Google App Passwords)

---

## 📌 Core Features

* **Developer Authentication:** Secure Sign-up and Login.
* **Forgot Password:** Automated password recovery system via email verification.
* **Public Discovery:** Recruiters can browse developer profiles without mandatory login.
* **Profile Management:** Developers can update their details and showcase projects.
* **Responsive UI:** Built with Tailwind CSS for a modern, mobile-friendly experience.

---

## ⚙️ Prerequisites (System Requirements)

Before you run this project, make sure you have the following installed on your machine:

1. **Node.js:** (v18 or higher recommended)
2. **MongoDB:** A local MongoDB instance or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string.
3. **NPM/Yarn:** For managing dependencies.
4. **Google Account:** For generating an **App Password** (required for `Nodemailer`).

---

## 🚀 Installation Guide

### 1. Clone the Repository

```bash
git clone https://github.com/naazasiim/codefolio.git
cd codefolio

```

### 2. Backend Setup

```bash
cd server
npm install

```

Create a `.env` file inside the `server/` folder and add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_google_app_password
CLIENT_URL=http://localhost:5173

```

### 3. Frontend Setup

```bash
cd ../client
npm install

```

### 4. Run the Project

* **Start Backend:** In the `server` folder, run `npm run dev`
* **Start Frontend:** In the `client` folder, run `npm run dev`

---

##  How to Contribute

1. Fork the repo.
2. Create a feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a Pull Request!

---

##  Author

**Naaz Asim**

* [GitHub](https://www.google.com/search?q=https://github.com/naazasiim)

---
