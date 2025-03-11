const mongoose = require('mongoose');

// Create login schema
const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: { 
        type: String,
        // required: true, 
        default: 'user' 
    },
    emailsent: { 
        type: Number, 
        default: 0 
    },
    textsent: { 
        type: Number, 
        default: 0 
    },
    outboundcall: { 
        type: Number, 
        default: 0 
    },
    phoneNumber: { 
        type: Number 
    },
    firstName: String,
    lastName: String,
    assignedManager: {  // Changed from employeeId to assignedManager
        type: String, 
    },
    designation: {  // Changed from employeeRole to designation
        type: String 
    },
    roles: [{
        type: mongoose.Schema.ObjectId,
        ref: 'RoleAccess',
        required: true
    }],
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    assignedEmployees: {
        type: Array,
        default: [],
    },
    
});

module.exports = mongoose.model('User', user, 'User');
