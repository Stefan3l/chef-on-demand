const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const chefRoutes = require("./routers/chefRoutes");
const authRoutes = require("./routers/authRoutes");
const dishRoutes = require("./routers/dishRoute");
const menuRoutes = require("./routers/menuRoute");

app.use(cors());
app.use(express.json());
app.use("/api/chefs", chefRoutes);
app.use("/api", authRoutes);
app.use("/api", dishRoutes);
app.use("/api", menuRoutes);

// cors middleware

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
