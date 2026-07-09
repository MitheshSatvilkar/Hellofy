const mongoose = require("mongoose");

const analyticsSchema = new mongoose.Schema({
    totalContacts: {
      type: Number,
      default: 0,
    },
    sent: {
      type: Number,
      default: 0,
    },

    delivered: {
      type: Number,
      default: 0,
    },

    failed: {
      type: Number,
      default: 0,
    },
},{
    _id:false
})

module.exports = analyticsSchema;