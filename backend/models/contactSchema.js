const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, "Contact name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[6-9]\d{9}$/, "Please enter a valid Indian mobile number"],
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Delivered", "Failed"],
      default: "Pending",
    },
    sentAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    failedAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    _id: true,
    timestamps: true,
  }
)

module.exports = contactSchema;

