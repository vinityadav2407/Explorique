# Explorique 🌍

**🌍 Explorique** – Discover Your Perfect Stay
Explorique is a fully-featured travel stay listing platform, developed as a major full-stack web development project. It empowers users to:
- 🔍 Search and explore accommodation listings from around the world

 - 🏡 Create, edit, and manage their own property listings with image uploads

- ✍️ Read and write reviews to share experiences with other travelers

- 🔐 Enjoy secure authentication, sessions, and flash messaging using Passport.js and MongoDB-backed sessions

- 📷 Upload images using Cloudinary with real-time URL transformations

- ⚙️ Built with Express.js, MongoDB, Mongoose, and   EJS, styled with Bootstrap

## 🚀 Features

- User Registration and Login (Passport.js + Sessions)
- Secure Authentication
- Create, Edit, Delete Listings
- Upload Images (Cloudinary + Multer)
- Add and Delete Reviews
- Flash Messages for Success/Error
- MongoDB Atlas for Database
- Responsive Frontend (EJS + Bootstrap)

## 🎥 Video

[🎬 Click here to watch the video demo](https://explorique-1.onrender.com/video/demo.mp4)


## 🛠️ Tech Stack

| Frontend  | Backend       | Database      | Authentication |
|-----------|---------------|----------------|----------------|
| HTML, CSS, Bootstrap, EJS | Node.js, Express.js | MongoDB Atlas | Passport.js |

## 📦 Installation

```bash
git clone https://github.com/your-username/explorique.git
cd explorique
npm install
```
## Create a `.env` file in the root folder and add the following:

```bash
MONGODB_ATLAS_URL=your_mongo_uri
SECRET=your_session_secret
GOOGLE_API_KEY=your_google_key
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
```
 ## 📁 Folder Structure
Explorique/
├── routes/
├── models/
├── views/
│   ├── listings/
│   ├── users/
│   ├── layouts/
│   └── include/
├── public/
├── utils/
├── uploads/
├── app.js
└── .env
### Start the server:
nodemon app.js
Visit: http://localhost:8080

## 👨‍💻 Author
- **@Vinit Yadav**,
LinkedIn Profile: [LinkedIn](linkedin.com/in/vinit-yadav-4b4753237)
## 📸 See live
- **Visit the my project:** [Explorique.com](https://explorique-1.onrender.com)

## 📄 License
This project, **Explorique – Travel Stay Listing Platform**, is licensed under the **MIT License**.

You are free to use, modify, distribute, and share this project for both personal and commercial purposes, provided that the original license and copyright notice are included.

See the full license text in the [LICENSE](LICENSE) file.

---