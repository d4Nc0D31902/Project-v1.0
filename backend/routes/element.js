const express = require("express");
const router = express.Router();

const {
  newElement,
  getElements,
  getSingleElement,
  updateElement,
  deleteElement,
} = require("../controllers/elementController");

const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

// Create a new element
router.post("/element/new", isAuthenticatedUser, newElement);

// Get all elements
router.get("/elements", getElements);

// Get a single element
router.get("/element/:id", isAuthenticatedUser, getSingleElement);

// Update an element
router.put("/element/:id", isAuthenticatedUser, updateElement);

// Delete an element
router.delete("/element/:id", isAuthenticatedUser, deleteElement);

module.exports = router;
