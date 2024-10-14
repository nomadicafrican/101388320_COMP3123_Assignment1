const Employee = require("./models/Employee");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.post("/api/v1/emp/employees", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    console.log(req.body);
    res.status(201).send("Employee added");
  } catch (error) {
    console.error("Error!", error);
    res.status(500).send("Error!");
  }
});

app.get("/api/v1/emp/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    console.log("Employees Retrieved:", employees);
    res.json(employees);
  } catch (error) {
    console.error("Error!", error);
    res.status(500).json({ message: "Error!" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
