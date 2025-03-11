const mongoose = require('mongoose');

const fetchSchemaFields = async () => {
    const CustomFieldModel = mongoose.model('CustomField');
    return await CustomFieldModel.find({ moduleName: "Contacts" });
};

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
    isEdited:{
type: Number,
        default: 0,
    },
    deleted: {
        type: Boolean,
        default: false,
    },
    // dialedCalls: {  // ✅ Add this field
    //     type: Number,
    //     default: 0  // Start with 0 if not already set
    // }
});


const initializeContactSchema = async () => {
    const schemaFieldsData = await fetchSchemaFields();
    schemaFieldsData[0]?.fields?.forEach((item) => {
        contactSchema.add({ [item.name]: item?.backendType });
    });
};

const Contact = mongoose.model('Contacts', contactSchema, 'Contacts');
module.exports = { Contact, initializeContactSchema };
