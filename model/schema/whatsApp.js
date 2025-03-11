const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WhatsAppLeadSchema = new Schema(
  {
    sender: {
      type: String,
      required: [true, 'Sender is required'],
      trim: true,
    },
    recipient: {
      type: String,
      trim: true,
      default: '', // Store email if available
    },
    recipientNumber: {
      type: Number,
      required: [true, 'Recipient number is required'],
      trim: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
    },
   
    startDate: {
      type: Date,
      required: [true, 'Start Date is required'],
    },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Linking to the User model
      required: [true, 'Creator ID is required'],
    },
   
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('WhatsApp', WhatsAppLeadSchema, 'WhatsApp');
