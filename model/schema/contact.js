const mongoose = require('mongoose');
const cron = require('node-cron');

// Function to fetch custom fields (this remains as is)
const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Contacts" });
};

// Contact schema definition
const contactSchema = new mongoose.Schema({
    interestProperty: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Properties',
    }],
    comments: [
        {
            comment: { type: String, required: true },
            createdAt: { type: Date, default: Date.now },
        }
    ],
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    isEdited: {
        type: Number,
        default: 0,
    },
    todayCalls: [
        {
            todayDailed: { type: Number, default: 0 },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    deleted: {
        type: Boolean,
        default: false,
    },
});

// Function to initialize schema fields dynamically (from external config or database)
const initializeContactSchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        contactSchema.add({ [item.name]: item?.backendType });
    });
};

// Cron job logic to reset `todayDailed` at midnight every day
cron.schedule('0 0 * * *', async () => {
    try {
        const today = moment().startOf('day').toDate(); // Get the start of today (midnight)
        
        // Find all contacts and update them
        await mongoose.model('Contacts').updateMany({}, {
            $set: { todayCalls: [{ todayDailed: 0, createdAt: today }] } // Resetting to only today's entry
        });

        console.log('All contacts have had their todayCalls reset for the new day');
    } catch (error) {
        console.error('Error resetting todayCalls:', error);
    }
});


// Create the model from the schema
const Contact = mongoose.model('Contacts', contactSchema, 'Contacts');

// Export the model and initialization function
module.exports = { Contact, initializeContactSchema };
