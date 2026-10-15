# CampusFind — Campus Lost and Found

CampusFind is a web application that helps students report, search for, and find lost belongings on campus. It provides a central place to post lost and found items, making it easier for students to reconnect with their belongings.

## Features

- **Report Lost Items:** Submit details of items that have been lost.
- **Report Found Items:** Post information about items found on campus.
- **Browse Listings:** View lost and found items in one place.
- **Search Items:** Search listings by keywords.
- **Filter Listings:** Filter items by type and category.
- **Item Details:** View descriptions, locations, and dates associated with items.
- **Database Integration:** Store and retrieve item listings using MySQL.
- **REST API:** Connect the React frontend to the Express backend.

## Tech Stack

**Frontend**
- React
- Vite
- HTML
- CSS
- JavaScript

**Backend**
- Node.js
- Express.js
- REST API

**Database**
- MySQL
- MySQL2

**Tools**
- Git and GitHub
- Visual Studio Code
- MySQL Workbench

## Project Structure

```text
campus-lost-found/
├── client/             # React frontend
├── server/             # Node.js and Express backend
│   ├── src/
│   │   ├── db.js       # MySQL connection
│   │   └── server.js   # API routes and server
│   └── .env            # Local environment variables
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

Install the following before running the application:

- Node.js and npm
- MySQL Server
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/CampusFind.git
cd CampusFind
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Set Up the Database

1. Start MySQL Server.
2. Open MySQL Workbench.
3. Create the database and tables using your project's SQL schema.
4. Ensure the `items` table contains the columns required by the backend.

```sql
CREATE DATABASE campus_lost_found;
```

If you have already created the database and tables, you do not need to create them again.

### 3. Configure the Backend

Open a terminal in the project folder and run:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_lost_found
```

Replace `your_mysql_password` with your local MySQL password. Never commit this file to GitHub.

Start the backend:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 4. Start the Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

`http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/items` | Retrieve all item listings |
| GET | `/api/items/:id` | Retrieve an item by ID |
| POST | `/api/items` | Create a lost or found listing |
| DELETE | `/api/items/:id` | Delete a listing |

## Future Improvements

- User registration and login
- Image uploads for lost and found items
- Item claim requests and verification
- Notifications when a matching item is posted
- Improved mobile responsiveness

## Author

**Tadepalli Meghana**

Computer Science and Engineering Student

[GitHub Profile](https://github.com/TadepalliMeghana)

---

*CampusFind is a student project designed to make campus lost-and-found reporting more convenient.*

## 🚀 Projects


- **Frontend Demo:** [Open CampusFind](http://localhost:5173/) — View and search lost and found listings.
- **Backend API:** [View Items API](http://localhost:5000/api/items) — Retrieve item listings from the backend.
- **Source Code:** [CampusFind on GitHub](https://github.com/TadepalliMeghana/CampusFind) — Explore the project code.
