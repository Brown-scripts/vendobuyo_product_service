// server.js
const express = require("express");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const productRoutes = require("./routes/product");
const shopRoutes = require("./routes/shop");
const { errorHandler } = require("./middleware/errorHandler");
const cors = require("cors");
// const { client, initializeIndexes } = require("./utils/elasticSearch");

dotenv.config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3002;

app.use(express.json());
app.use(fileUpload());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Initialize Elasticsearch indices
// initializeIndexes();

// Test route
app.get("/test", (req, res) => {
  res.status(200).json({ message: "Hello from VendobuyoAPI!" });
});

// Routes
app.use("", productRoutes);
app.use("/shops", shopRoutes);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Product service running on port ${PORT}`);
});
