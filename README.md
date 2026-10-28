# 🎬 IMovies — Premium Movie Ticket Booking System

**IMovies** is a cinematic movie ticket booking web application built using the MERN stack technologies. It provides an attractive movie discovery experience with movie search, category filters, interactive seat selection, showtime selection, ticket booking, and booking history.

The project is designed as a student full-stack development project with a premium dark-themed user interface.

## 🌟 Features

### 🎥 Movie Discovery
- Premium cinematic dark-themed interface.
- Movie posters, ratings, release years, and genres.
- Search movies by title or genre.
- Filter movies by categories such as Sci-Fi, Action, Drama, Thriller, and Adventure.
- Responsive movie cards with booking buttons.

### 🎟️ Ticket Booking
- Select a movie and preferred showtime.
- Interactive seat selection.
- Visual indicators for available, selected, and booked seats.
- Automatic ticket price calculation.
- Booking confirmation with a unique booking ID.
- View booking details and cancel demo bookings.

### 👤 User Authentication
- Login and signup interface.
- Display the logged-in user's name.
- User-specific booking history in the frontend demo.

### 🛡️ Admin Panel
- Separate Admin Panel route at `/admin`.
- Admin login configuration through environment variables.
- Backend API integration for administrative operations.
- Intended dashboard features include booking management, booking statistics, and cancellation.

*Admin dashboard functionality depends on the backend configuration, database connection, and successful API integration.*

### 💻 User Interface
- Modern cinematic styling.
- Dark theme with accent colors.
- Interactive buttons and navigation.
- Movie poster imagery.
- Dedicated booking and booking-history sections.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Web page structure |
| CSS3 | Styling and responsive UI |
| JavaScript | Application logic |
| React.js | Frontend development |
| Vite | Frontend development server and build tool |
| Node.js | Backend runtime |
| Express.js | REST API development |
| MongoDB | Database for backend data |
| Mongoose | MongoDB object modeling |
| JWT | Token-based authentication |
| Git & GitHub | Version control and project hosting |
| Vercel / Render | Deployment platforms |

## 📂 Project Structure

```text
IMovies/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── Auth.jsx
│   │   ├── Admin.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── .gitignore
└── README.md
```

*The structure above represents the main project files; additional files and folders may exist in your repository.*

## ⚙️ Installation and Setup

### Prerequisites

Install the following tools before running the project:

- [Node.js](https://nodejs.org/)
- [Visual Studio Code](https://code.visualstudio.com/)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)
- [Git](https://git-scm.com/)

MongoDB Compass is useful for viewing database contents, but Compass alone does not start the MongoDB database server.

### 1. Clone the Repository

Open a terminal and run:

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd IMovies
```

Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Set Up the Frontend

```bash
cd frontend
npm install
npm.cmd run dev
```

Open the local development URL printed in the terminal, usually:

```text
http://localhost:5173
```

### 3. Set Up the Backend

Open a second terminal:

```bash
cd backend
npm install
npm run dev
```

If your project uses Windows PowerShell and blocks `npm.ps1`, use:

```powershell
npm.cmd run dev
```

The backend is configured to use port `5000` by default, unless your application configuration specifies otherwise.

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` directory. Add your own local configuration:

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/imovies
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_strong_password
```

**Important:**
- Replace the example values with your own secure credentials.
- Keep `.env` private and never commit it to GitHub.
- Ensure the MongoDB server is running before starting a backend that requires MongoDB.
- Confirm that `server.js` uses these exact environment variable names.
- Restart the backend after changing `.env`.

### 5. Open the Admin Panel

After starting the frontend, open:

```text
http://localhost:5173/admin
```

Use the admin email and password configured in your local environment. The Admin Panel requires the corresponding backend routes and database configuration to work correctly.

## 🔄 Application Workflow

1. Open the IMovies website.
2. Sign in or create an account.
3. Explore available movies.
4. Search for a movie or select a genre.
5. Click **Book Now**.
6. Choose a showtime and select available seats.
7. Review the ticket price and total amount.
8. Confirm the demo booking.
9. View or cancel bookings in the booking-history section.

## 💰 Ticket Pricing

The current frontend demo uses a fixed price of **₹250 per seat**.

The total amount is calculated as:

```text
Total Amount = Number of Selected Seats × ₹250
```

No real payment is collected in the current demo booking flow.

## 🗄️ Data Storage

The frontend demo stores user-session information and demo bookings in the browser's `localStorage`.

The backend is configured for MongoDB-based data handling. Frontend demo bookings and backend database bookings should not be assumed to be automatically synchronized; that requires the booking flow to be connected to the backend API.

## 🚀 Deployment

The frontend and backend can be deployed separately.

- **Frontend:** Vercel
- **Backend:** Render
- **Database:** MongoDB Atlas or another configured MongoDB server

### Deployment Checklist

- Configure the frontend's production API URL.
- Configure backend environment variables on the hosting platform.
- Use a production MongoDB connection string.
- Configure CORS for the deployed frontend domain.
- Set a strong JWT secret and secure admin credentials.
- Verify the login, booking, and Admin Panel API routes.
- Test the deployed application before sharing the demo.

Never include real credentials, database passwords, or private API secrets in the repository.

## 🔮 Future Enhancements

- Connect all bookings to the backend database.
- Implement persistent user authentication with JWT.
- Complete Admin Panel analytics and booking management.
- Add payment gateway integration.
- Add movie details and theatre selection.
- Introduce multiple theatres and show schedules.
- Add email booking confirmations.
- Improve mobile responsiveness and accessibility.
- Add automated testing and error handling.

## 🎓 Project Information

**Project Name:** IMovies — Movie Ticket Booking System  
**Project Type:** Full Stack Web Development  
**Project Domain:** MERN Stack Development  
**Developer:** Tanu Rajput

**Purpose:** A student project demonstrating frontend development, booking workflows, API integration, authentication concepts, and database-backed application development.

## 📄 License

This project is intended for educational and demonstration purposes. Add a license file if you want to specify the terms under which others may use, modify, or distribute the code.

---

⭐ If you find this project interesting, feel free to explore the code and share feedback!
