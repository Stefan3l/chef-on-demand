const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");

// Importing routers
const chefRoutes = require("./routers/chefRoutes");
const authRoutes = require("./routers/authRoutes");
const dishRoutes = require("./routers/dishRoute");
const menuRoutes = require("./routers/menuRoute");
const messageRoutes = require("./routers/messageRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/chefs", chefRoutes);
app.use("/api", authRoutes);
app.use("/api", dishRoutes);
app.use("/api", menuRoutes);
app.use("/api/messages", messageRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Server static per uploads

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
