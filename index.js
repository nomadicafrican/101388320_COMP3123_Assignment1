const express = require("express");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const connectDB = require("./db");

const app = express();

app.use(express.json());

connectDB();

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/emp", employeeRoutes);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
