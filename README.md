# Colour Palette Generator

## Project Overview

Colour Palette Generator is a full-stack web application that generates random HEX color palettes and allows users to store them in a MongoDB database.

This project demonstrates backend architecture using Node.js, Express, MongoDB, and Mongoose following an MVC structure.

---

## Features

- Generate random HEX color palettes
- Save palettes to MongoDB
- Retrieve all saved palettes
- RESTful API design
- Scalable MVC architecture
- Environment-based configuration

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- dotenv
- CORS

### Frontend (Optional / Extendable)
- React.js
- Axios
- CSS

---

## Project Structure

```
colour-palette-generator/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   └── paletteController.js
│   │   ├── models/
│   │   │   └── Palette.js
│   │   ├── routes/
│   │   │   └── paletteRoutes.js
│   │   ├── utils/
│   │   │   └── colorUtils.js
│   │   └── app.js
│   │
│   ├── .env
│   ├── package.json
│   └── .gitignore
│
└── README.md
```

---

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/23wh1a0512/Colour_pallate.git
cd Colour_pallate/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the backend folder:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/colourPaletteDB
```

Ensure MongoDB is running locally.

### 4. Run the Server

```bash
npm run dev
```

Server will start at:

```
http://localhost:5000
```

---

## API Endpoints

### Generate New Palette

GET  
`/api/palette/generate`

Example Response:

```json
{
  "palette": ["#A1B2C3", "#FF5733", "#123456", "#000000", "#FFFFFF"]
}
```

---

### Save Palette

POST  
`/api/palette/save`

Request Body:

```json
{
  "name": "Ocean Theme",
  "colors": ["#001F3F", "#0074D9", "#7FDBFF", "#39CCCC", "#3D9970"]
}
```

---

### Get All Saved Palettes

GET  
`/api/palette/all`

---

## Database Schema

```javascript
{
  name: String,
  colors: [String],
  createdAt: Date,
  updatedAt: Date
}
```

---

## Architecture

- MVC (Model-View-Controller) structure
- Separate route handling
- Centralized database configuration
- Utility-based color generation logic
- Environment variable management

---

## Future Improvements

- User authentication using JWT
- Delete palette functionality
- Search palettes by color
- Favorite or like feature
- Frontend UI with React
- Deployment using cloud services

---

## Author

Siri  
GitHub: https://github.com/23wh1a0512

---

## License

This project is developed for educational and learning purposes.
