const path = require('path');
const dotenv = require('dotenv');

// Load env variables first
dotenv.config({
  path: path.resolve(__dirname, 'config/.env'), // ensure path is correct
});

const app = require("./app");
const connectDatabase = require("./db/Database.js");

const PORT = process.env.PORT || 8000;

// Connect Database
connectDatabase();

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err.message}`);
  console.error("Shutting down server due to uncaught exception");
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
  console.error("Shutting down server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});