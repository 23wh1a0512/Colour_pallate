# Color Palette Generator

Color Palette Generator is a full-stack web application with a clearly separated `frontend` and `backend`. Users can sign up, log in, generate themed palettes, edit colors, save palettes, mark favorites, and export palette data in multiple formats.

## Repository Layout

```text
Colour_pallate/
|-- frontend/
|   |-- index.html
|   |-- home.html
|   |-- generator.html
|   |-- actions.html
|   |-- library.html
|   |-- script.js
|   `-- styles.css
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   |-- utils/
|   |   |-- app.js
|   |   `-- server.js
|   |-- .env.example
|   |-- .gitignore
|   `-- package.json
|-- package.json
`-- README.md
```

## Frontend

The `frontend/` folder contains the user interface for:

- authentication pages
- palette generation workspace
- export and palette action tools
- saved palette library management

Key frontend files:

- `frontend/index.html`
- `frontend/home.html`
- `frontend/generator.html`
- `frontend/actions.html`
- `frontend/library.html`
- `frontend/script.js`
- `frontend/styles.css`

## Backend

The `backend/` folder contains the Express and MongoDB application for:

- authentication APIs
- palette generation APIs
- palette CRUD operations
- favorite toggle support
- MongoDB connection and validation

Main backend features:

- Express.js server
- MongoDB with Mongoose
- REST API routes
- palette validation
- user authentication flow

## Setup

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Create environment file

```bash
copy .env.example .env
```

Set:

```env
MONGO_URI=mongodb://127.0.0.1:27017/colourPaletteDB
PORT=5000
```

### 3. Run from project root

```bash
cd ..
npm run dev
```

Or start production mode:

```bash
npm start
```

Open:

```text
http://localhost:5000/
```

## API Endpoints

- `GET /api/health`
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/palette/generate`
- `GET /api/palette`
- `POST /api/palette`
- `PUT /api/palette/:id`
- `PATCH /api/palette/:id/favorite`
- `DELETE /api/palette/:id`

## Features

- login and signup
- themed palette generation
- swatch editing, locking, refreshing, and copying
- palette save, update, delete, and favorite
- JSON, CSV, CSS variable, gradient, and Tailwind-style export
- multi-page frontend structure with shared palette state

## Tech Stack

- HTML
- CSS
- JavaScript
- Node.js
- Express.js
- MongoDB
- Mongoose

## Author

Siri  
GitHub: https://github.com/23wh1a0512

Screen Recording of the 
https://drive.google.com/file/d/1TFaEd5EfOKzu7TfGop4H6zXh8TQtdNTt/view?usp=drive_link
