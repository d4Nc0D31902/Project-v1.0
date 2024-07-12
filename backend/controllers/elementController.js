const Element = require("../models/element");
const ErrorHandler = require("../utils/errorHandler");
const APIFeatures = require("../utils/apiFeatures");

// Create new element
exports.newElement = async (req, res, next) => {
  try {
    const element = await Element.create(req.body);
    res.status(201).json({
      success: true,
      element,
    });
  } catch (error) {
    next(error);
  }
};

// Get all elements
exports.getElements = async (req, res, next) => {
  const elements = await Element.find();
  res.status(200).json({
    success: true,
    elements,
  });
};

// Get single element
exports.getSingleElement = async (req, res, next) => {
  try {
    const element = await Element.findById(req.params.id);

    if (!element) {
      return next(new ErrorHandler("Element not found", 404));
    }

    res.status(200).json({
      success: true,
      element,
    });
  } catch (error) {
    next(error);
  }
};

// Update element
exports.updateElement = async (req, res, next) => {
  try {
    let element = await Element.findById(req.params.id);

    if (!element) {
      return next(new ErrorHandler("Element not found", 404));
    }

    element = await Element.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      element,
    });
  } catch (error) {
    next(error);
  }
};

// Delete element
exports.deleteElement = async (req, res, next) => {
  try {
    const element = await Element.findById(req.params.id);

    if (!element) {
      return next(new ErrorHandler("Element not found", 404));
    }

    await element.remove();

    res.status(200).json({
      success: true,
      message: "Element deleted",
    });
  } catch (error) {
    next(error);
  }
};
