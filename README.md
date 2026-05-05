# 🏙️ SimCity Strategy Game

Welcome to **SimCity**, a full-stack strategy game where players build their empires, join factions, and battle for supremacy! 🚀

## 🌟 Features

*   **🔐 Authentication**: Secure User Login & Registration.
*   **⚔️ Faction System**: Choose your side and fight for your team's glory.
*   **🏗️ City Building**: Manage resources and build up your city (Infrastructure, Economy, Military).
*   **⚔️ War & Battles**: Engage in attacks against other players or factions.
*   **🛡️ War State Control**: Global war state that can be enabled/disabled by admins.
*   **🏆 Leaderboard**: Real-time rankings to see who dominates the server.
*   **🛒 Shop**: Buy upgrades and items to boost your progress.
*   **📖 Dynamic Help**: Interactive "How to Play" and "Help" guides.

---

## 🛠️ Tech Stack

### Frontend (`/simcity`)
*   **⚛️ Framework**: React (Vite)
*   **🎨 Styling**: Tailwind CSS v4
*   **🛣️ Routing**: React Router Dom
*   **🔥 BaaS**: Firebase (Auth)
*   **✨ Icons**: Lucide React
*   **📡 API**: Axios

### Backend (`/simcity_backend`)
*   **🟢 Runtime**: Node.js
*   **⚡ Framework**: Express.js
*   **🗄️ Database**: MongoDB (Mongoose)
*   **🔐 Auth**: JWT & Bcrypt
*   **🐳 Containerization**: Docker support

---

## 🚀 Getting Started

### Prerequisites
*   Node.js (v16+)
*   MongoDB (Local or Atlas)
*   Git

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/devprashant19/simcity_backend
cd simcity_backend
```

---

### 2️⃣ Backend Setup (`/simcity_backend`)

Navigate to the backend folder:
```bash
cd simcity_backend
```

Install dependencies:
```bash
npm install
```

**Configuration (.env):**
Create a `.env` file in `simcity_backend` with the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
# Add other backend specific env vars here
```

**Database Seeding:**
To populate the game with initial data:
```bash
node seed_game.js
```

**War State Management:**
*   Enable War: `node enableWar.js`
*   Disable War: `node disableWar.js`

**Start the Server:**
```bash
npm start # or node server.js
```
*Server will run on `http://localhost:5000` (default)*

---

### 3️⃣ Frontend Setup (`/simcity`)

Open a new terminal and navigate to the frontend folder:
```bash
cd simcity
```

Install dependencies:
```bash
npm install
```

**Configuration (.env):**
Create a `.env` file in `simcity`:
```env
VITE_API_URL=http://localhost:5000
# Add Firebase config if needed
```

**Start the Development Server:**
```bash
npm run dev
```
*App will open at `http://localhost:5173`*

---

## 🌍 Deployment

*   **Frontend**: Deployed on [Vercel](https://vercel.com/) ▲
*   **Backend**: Deployed on [Google Cloud](https://cloud.google.com/) ☁️

---

## 📂 Project Structure

```bash
ssity/
├── 📁 simcity/             # Frontend (React + Vite)
│   ├── 📁 src/
│   │   ├── 📁 components/  # Reusable UI components
│   │   ├── 📁 pages/       # Game pages (Game, Shop, Attack, etc.)
│   │   ├── 📁 contexts/    # React Context (Auth, Game State)
│   │   └── ...
│   └── ...
├── 📁 simcity_backend/     # Backend (Express + Node)
│   ├── 📁 src/
│   │   ├── 📁 models/      # Mongoose Models (User, Battle, etc.)
│   │   ├── 📁 controllers/ # Game Logic
│   │   └── ...
│   ├── 📜 server.js        # Entry point
│   └── ...
└── 📁 end/                 # Additional web assets or landing page
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1.  Fork the project.
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**Happy Building! 🏗️**
