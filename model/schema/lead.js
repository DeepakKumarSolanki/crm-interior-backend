const mongoose = require('mongoose');
const cron = require('node-cron');

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Leads" });
};

const leadSchema = new mongoose.Schema({
    // // Lead Information:
    // leadName: String,
    // leadEmail: String,
    // leadPhoneNumber: String,
    // leadAddress: String,
    // // Lead Source and Details:
    // leadSource: String,
    // leadStatus: String,
    // leadSourceDetails: String,
    // leadCampaign: String,
    // leadSourceChannel: String,
    // leadSourceMedium: String,
    // leadSourceCampaign: String,
    // leadSourceReferral: String,
    // // Lead Assignment and Ownership:
    // leadAssignedAgent: String,
    // leadOwner: String,
    // // Lead Dates and Follow - up:
    // leadCreationDate: Date,
    // leadConversionDate: Date,
    // leadFollowUpDate: Date,
    // leadFollowUpStatus: String,
    // // Lead Interaction and Communication:
    // // leadInteractionHistory: [{ leadHistory }],
    // leadNotes: String,
    // leadCommunicationPreferences: String,
    // // Lead Scoring and Nurturing:
    // leadScore: Number,
    // leadNurturingWorkflow: String,
    // leadEngagementLevel: String,
    // leadConversionRate: Number,
    // leadNurturingStage: String,
    // leadNextAction: String,
    deleted: {
        type: Boolean,
        default: false,
    },
    updatedDate: {
        type: Date,
        default: Date.now
    },
    createdDate: {
        type: Date,
    },
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isEdited:{
        type: Number,
                default: 0,
            },

            todayCalls: [
                {
                    todayDailed: { type: Number, default: 0 },
                    createdAt: { type: Date, default: Date.now }
                }
            ],       
});

const initializeLeadSchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        leadSchema.add({ [item.name]: item?.backendType });
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





const Lead = mongoose.model('Leads', leadSchema, 'Leads');
module.exports = { Lead, initializeLeadSchema };
