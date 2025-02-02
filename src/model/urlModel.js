const mongoose = require("mongoose");



const urlSchema = new mongoose.Schema(
  {
    longUrl: {
      type: String,
      required: true,
    },
    shortUrl: {
      type: String,
      required: true,
      unique: true,
    },
    urlCode: {
      type: String,
      required: true,
      unique: true,
    },
    alias: {
      type: String,
      unique: true, // Enforce uniqueness
      sparse: true, // Allow multiple `null` values
    },
    topic: {
      type: String,
      enum: ["acquisition", "activation", "retention"],
      default: "acquisition",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    clicks: {
      type: Number,
      required: true,
      default: 0,
    },
    analytics: [
      {
        userAgent: String,
        ipAddress: String,
        location: {
          country: String,
          region: String,
          city: String,
          latitude: Number,
          longitude: Number,
        },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Url", urlSchema);
