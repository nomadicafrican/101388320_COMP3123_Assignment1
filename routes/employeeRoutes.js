const express = require("express");
const router = express.Router();
const Employee = require("../models/Employee");
const { ObjectId } = require("mongoose").Types;

// GET /api/v1/emp/employees
router.get("/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    const formattedEmployees = employees.map((emp) => ({
      id: emp._id,
      first_name: emp.first_name,
      last_name: emp.last_name,
      email: emp.email,
      position: emp.position,
      salary: emp.salary,
      date_of_joining: emp.date_of_joining,
      department: emp.department,
    }));
    res.status(200).json(formattedEmployees);
  } catch (error) {
    res.status(500).json({ message: "Error!" });
  }
});

router.get("/employees/:eid", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.eid);
    if (!employee)
      return res.status(404).json({ message: "Employee doesnt exist." });
    res.status(200).json(employee);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving employee details." });
  }
});

router.post("/employees", async (req, res) => {
  const {
    first_name,
    last_name,
    email,
    position,
    salary,
    date_of_joining,
    department,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !email ||
    !position ||
    !salary ||
    !date_of_joining ||
    !department
  ) {
    return res.status(400).json({ message: "All fields are required!" });
  }

  const newEmployee = new Employee({
    first_name,
    last_name,
    email,
    position,
    salary,
    date_of_joining,
    department,
  });

  try {
    const savedEmployee = await newEmployee.save();
    console.log("Employee created:", savedEmployee);
    res.status(201).json(savedEmployee);
  } catch (error) {
    console.error("Error creating employee:", error);
    res.status(500).json({ message: "Error creating employee." });
  }
});

router.put("/employees/:eid", async (req, res) => {
  const { position, salary } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.eid,
      { position, salary },
      { new: true }
    );
    if (!employee)
      return res.status(404).json({ message: "Employee not found." });
    res.status(200).json({ message: "Employee details updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating employee details." });
  }
});

router.delete("/employees", async (req, res) => {
  console.log("hello");
  const { eid } = req.query;
  if (!ObjectId.isValid(eid)) {
    return res.status(400).json({ message: "Invalid employee ID." });
  }
  try {
    const result = await Employee.findByIdAndDelete(eid);
    if (!result)
      return res.status(404).json({ message: "Employee not found." });
    res.status(204).json({ message: "Employee deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting employee." });
  }
});

module.exports = router;
