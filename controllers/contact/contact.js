const { Contact } = require('../../model/schema/contact')
const email = require('../../model/schema/email')
const MeetingHistory = require('../../model/schema/meeting')
const phoneCall = require('../../model/schema/phoneCall')
const Task = require('../../model/schema/task')
const TextMsg = require('../../model/schema/textMsg')
const DocumentSchema = require('../../model/schema/document')

// const index = async (req, res) => {
//     const query = req.query
//     query.deleted = false;

//     let allData = await Contact.find(query).populate({
//         path: 'createBy',
//         match: { deleted: false } // Populate only if createBy.deleted is false
//     }).exec()

//     const result = allData.filter(item => item.createBy !== null);

//     try {
//         res.send(result)
//     } catch (error) {
//         res.send(error)
//     }
// }


const index = async (req, res) => {
    console.log(req.query,"**********************")
    try {
        const query = { ...req.query, deleted: false }; // Ensure `deleted` is part of the query

        // Fetch data with `createBy` and `assignedTo` populated, including `email` for `assignedTo`
        let allData = await Contact.find(query)
            .populate({
                path: 'createBy',
                match: { deleted: false }, // Populate only if createBy.deleted is false
            })
            .populate({
                path: 'assignedTo',
                select: 'email', // Include only the `email` field for assignedTo
                match: { deleted: false }, // Populate only if assignedTo.deleted is false
            })
            .exec();

        // Filter out items where `createBy` is null
        const result = allData.filter(item => item.createBy !== null);

        // Respond with the result
        res.send(result);
    } catch (error) {
        // Handle errors
        res.status(500).send({ error: 'An error occurred', details: error.message });
    }
};


// const add = async (req, res) => {
//     console.log(req.body)
//     try {
//         // Get the lead remark from the request body
//         const { leadRemark } = req.body;

//         // Define the mappings between lead remarks and their statuses
//         const statusMappings = {
//             cold: ["rnr", "notInterested", "busy", "notReachable", "currenltyNotInterested", "leadLost"],
//             warm: ["followUp", "visitScheduled", "visitReschedule", "videoCallScheduled", "videoCallReschedule"],
//             hot: ["visitedDone", "bookingDone","OfficeVisitSchedule","OfficeVisitReschedule"],
//             booked:["salesClosed","alreadyPurchased"]
//         };

//         // Check if the leadRemark is valid and determine the leadStatus
//         let leadStatus;
//         for (const [status, remarks] of Object.entries(statusMappings)) {
//             if (remarks.includes(leadRemark)) {
//                 leadStatus = status;
//                 break;
//             }
//         }

//         // If leadRemark is invalid, return an error
//         if (!leadStatus) {
//             return res.status(400).json({ success: false, message: "Invalid leadRemark for status update" });
//         }

//         // Set the leadStatus based on the remark and add createdDate
//         req.body.createdDate = new Date();
//         req.body.leadStatus = leadStatus;  // Set the determined leadStatus in the request body

//         // Create a new contact and save to the database
//         const user = new Contact(req.body);
//         await user.save();

//         // Return the newly created user with the leadStatus included
//         res.status(200).json(user);
//     } catch (err) {
//         console.error('Failed to create Contact:', err);
//         res.status(400).json({ error: 'Failed to create Contact' });
//     }
// };


const add = async (req, res) => {
    console.log(req.body);
    try {
        const { leadRemark } = req.body;

        // Define the mappings between lead remarks and their statuses
        const statusMappings = {
            cold: ["wantsInteriorAfter90Days", "budgetIsLessThan10Lakhs", "possesionMoreThan90Days", "move-InCriteriaMoreThan120Days", "currenltyNotInterested", "rnr","busy"],
            warm: ["followUp","siteVisitSchedule","vcSchedule","re-ScheduleSiteVisit","re-RescheduleVC","inOfficeMeetingSchedule","re-ScheduleOfficeMeeting", "wantsInteriorWithin60-90Days", "budgetIsMoreThan10Lakhs", "possesionWithin60-90Days", "move-InCriteriaWithin60-90Days"],
            hot: ["wantsInteriorWithinAMonth", "budgetIsMoreThan30Lakhs", "possesionWithin45-60Days", "move-InCriteriaWithin30-60Days"],
            junk: ["outOfBangalore", "notLookingForInterior","notPurchasedHouse","interiorAlreadyDone","budgetIsLessThan3Lakhs","incorrectContactDetails","leadLost"]
        };

        // Determine leadStatus based on leadRemark
        let leadStatus;
        for (const [status, remarks] of Object.entries(statusMappings)) {
            if (remarks.includes(leadRemark)) {
                leadStatus = status;
                break;
            }
        }

        if (!leadStatus) {
            return res.status(400).json({ success: false, message: "Invalid leadRemark for status update" });
        }

        // Ensure comments is stored as an array (not a string)
        req.body.createdDate = new Date();
        req.body.leadStatus = leadStatus;

        if (typeof req.body.comments === "string") {
            try {
                req.body.comments = JSON.parse(req.body.comments); // Convert back to array if sent as a string
            } catch (error) {
                console.error("Failed to parse comments:", error);
                req.body.comments = []; // Default to empty array if parsing fails
            }
        }

        // Create a new contact and save to the database
        const user = new Contact(req.body);
        await user.save();

        res.status(200).json(user);
    } catch (err) {
        console.error("Failed to create Contact:", err);
        res.status(400).json({ error: "Failed to create Contact" });
    }
};


const addMany = async (req, res) => {
    console.log(".................................................",req.body)
    try {
        const data = req.body;
        const insertedContact = await Contact.insertMany(data);
        res.status(200).json(insertedContact);
    } catch (err) {
        console.error('Failed to create Contact :', err);
        res.status(400).json({ error: 'Failed to create Contact' });
    }
};

const addPropertyInterest = async (req, res) => {
    try {
        const { id } = req.params
        await Contact.updateOne({ _id: id }, { $set: { interestProperty: req.body } });
        res.send(' uploaded successfully.');
    } catch (err) {
        console.error('Failed to create Contact:', err);
        res.status(400).json({ error: 'Failed to create Contact' });
    }
}


// const changeStatus = async (req, res) => {
//     try {
//         // Get the name value from the request
//         const { name } = req.body;  
//         let leadStatus;

//         // logic to set the lead status based on name
//         if (["RNR", "Not Interested", "Busy", "Not Reachable","Currenlty Not Interested","Lead Lost"].includes(name)) {
//             leadStatus = "cold";
//         } else if (["Follow Up", "Site Visit Schedule","Site Visit Reschedule","Video Call Schedule","Video Call Reschedule"].includes(name)) {
//             leadStatus = "warm";
//         } else if (["Site Visited Done","Booking Done"].includes(name)) {
//             leadStatus = "hot";
//         } else {
//             return res.status(400).json({ success: false, message: "Invalid name for status update" });
//         }

//         // Update the lead's status
//         const result = await Contact.findOneAndUpdate(
//             { _id: req.params.id },
//             { $set: { leadStatus } },
//             { new: true }
//         );

//         if (!result) {
//             return res.status(404).json({ success: false, message: 'Lead not found' });
//         }

//         return res.status(200).json({ message: "Status updated successfully", result });
//     } catch (err) {
//         console.error('Failed to change status:', err);
//         return res.status(400).json({ error: 'Failed to change status', err });
//     }
// };


const changeStatus = async (req, res) => {
    try {
        // Get the name value from the request
        const { name } = req.body;

        // Define the mappings between lead remarks and their statuses
        const statusMappings = {
            cold: ["Wants Interior After 90 Days", "Budget is Less Than 10 Lakhs", "Possesion More Than 90 Days",  "Currenlty Not Interested", "RNR","Busy","Move in Criteria More Than 120 Days"],
            warm: ["Follow Up", "Site Visit Schedule", "Site Visit Reschedule", "Video Call Schedule", "Video Call Reschedule","Office Meeting Schedule","Office Meeting Reschedule","Wants Interior Within 60-90 Days","Budget is More Than 10 Lakhs","Possesion Within 60-90 Days","Move in Criteria Within 60-90 Days"],
            hot: ["Wants Interior Within A Month", "Budget is More Than 30 Lakhs", "Possesion Within 45-60 Days", "Move-In Criteria Within 30-60 Days"],
            junk: ["Out of Bangalore","Not Looking For Interior","Not Purchased House","Interior Already Done","Budget is Less Than 3 Lakhs","Incorrect Contact Details","Lead Lost"]
        };

        // Check if the name is valid in any status category
        let leadStatus;
        for (const [status, remarks] of Object.entries(statusMappings)) {
            if (remarks.includes(name)) {
                leadStatus = status;
                break;
            }
        }

        // If the leadStatus is not set, return an error
        if (!leadStatus) {
            return res.status(400).json({ success: false, message: "Invalid name for status update" });
        }

        // Update the lead's status
        const result = await Contact.findOneAndUpdate(
            { _id: req.params.id },
            { $set: { leadStatus } },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Lead not found' });
        }

        return res.status(200).json({ message: "Status updated successfully", result });
    } catch (err) {
        console.error('Failed to change status:', err);
        return res.status(400).json({ error: 'Failed to change status', err });
    }
};


// const edit = async (req, res) => {
//     try {
//         let result = await Contact.updateOne(
//             { _id: req.params.id },
//             { $set: req.body }
//         );
//         res.status(200).json(result);
//     } catch (err) {
//         console.error('Failed to Update Contact:', err);
//         res.status(400).json({ error: 'Failed to Update Contact' });
//     }
// }

// const edit = async (req, res) => {
//     console.log(req.body,".................................................")
//     try {
//         // Extract leadRemark from the request body
//         const { leadRemark } = req.body;
// console.log(leadRemark)
//         // Define the mappings between lead remarks and their statuses
//         const statusMappings = {
//             cold: ["RNR", "Not Interested", "Busy", "Not Reachable", "Currenlty Not Interested", "Lead Lost"],
//             warm: ["Follow Up", "Site Visit Schedule", "Site Visit Reschedule", "Video Call Schedule", "Video Call Reschedule"],
//             hot: ["Site Visited Done", "Booking Done"]
//         };

//         // Determine the leadStatus based on the leadRemark
//         let leadStatus;
//         for (const [status, remarks] of Object.entries(statusMappings)) {
//             if (remarks.includes(leadRemark)) {
//                 leadStatus = status;
//                 break;
//             }
//         }

//         // If leadRemark is valid, update the leadStatus in the request body
//         if (leadStatus) {
//             req.body.leadStatus = leadStatus;
//         } else {
//             // If no valid status is found, return an error
//             return res.status(400).json({ success: false, message: "Invalid leadRemark for status update" });
//         }

//         // Update the contact, including the leadStatus
//         let result = await Contact.updateOne(
//             { _id: req.params.id },
//             { $set: req.body }
//         );

//         // Return the result after the update
//         res.status(200).json(result);
//     } catch (err) {
//         console.error('Failed to Update Contact:', err);
//         res.status(400).json({ error: 'Failed to Update Contact' });
//     }
// };
// const edit = async (req, res) => {
//     console.log(req.body, ".................................................");
//     try {
//         const { leadRemark, comments } = req.body;

//         console.log("Lead Remark:", leadRemark);
//         console.log("New Comment:", comments);

//         // Define the mappings between lead remarks and their statuses
//         const statusMappings = {
//             cold: ["RNR", "Not Interested", "Busy", "Not Reachable", "Currently Not Interested", "Lead Lost"],
//             warm: ["Follow Up", "Site Visit Schedule", "Site Visit Reschedule", "Video Call Schedule", "Video Call Reschedule"],
//             hot: ["Site Visited Done", "Booking Done"]
//         };

//         // Determine the leadStatus based on the leadRemark
//         let leadStatus;
//         for (const [status, remarks] of Object.entries(statusMappings)) {
//             if (remarks.includes(leadRemark)) {
//                 leadStatus = status;
//                 break;
//             }
//         }

//         if (!leadStatus) {
//             return res.status(400).json({ success: false, message: "Invalid leadRemark for status update" });
//         }

//         // Prepare the update object
//         let updateData = { leadStatus };

//         // If new comments exist, append them to the existing comments array
//         if (comments) {
//             updateData.$push = { comments: { $each: comments } };
//         }

//         // Update the contact, including the leadStatus and appending new comments
//         let result = await Contact.updateOne(
//             { _id: req.params.id },
//             { $set: updateData }
//         );

//         res.status(200).json(result);
//     } catch (err) {
//         console.error("Failed to Update Contact:", err);
//         res.status(400).json({ error: "Failed to Update Contact" });
//     }
// };
const edit = async (req, res) => {
    console.log(req.body, ".................................................");
    try {
        const { leadRemark, comments,dialedCalls } = req.body;

        console.log("Lead Remark:", leadRemark);
        console.log("New Comment:", comments);
        console.log("dialedCalls:", dialedCalls);

        // Define the mappings between lead remarks and their statuses
        const statusMappings = {
            cold: ["Wants Interior After 90 Days", "Budget is Less Than 10 Lakhs", "Possesion More Than 90 Days",  "Currenlty Not Interested", "RNR","Busy","Move in Criteria More Than 120 Days"],
            warm: ["Follow Up", "Site Visit Schedule", "Site Visit Reschedule", "Video Call Schedule", "Video Call Reschedule","Office Meeting Schedule","Office Meeting Reschedule","Wants Interior Within 60-90 Days","Budget is More Than 10 Lakhs","Possesion Within 60-90 Days","Move in Criteria Within 60-90 Days"],
            hot: ["Wants Interior Within A Month", "Budget is More Than 30 Lakhs", "Possesion Within 45-60 Days", "Move-In Criteria Within 30-60 Days"],
            junk: ["salesClosed", "alreadyPurchased","Out of Bangalore","Not Looking For Interior","Not Purchased House","Interior Already Done","Budget is Less Than 3 Lakhs","Incorrect Contact Details","Lead Lost"]
        }

        // Determine the leadStatus based on the leadRemark
        let leadStatus;
        for (const [status, remarks] of Object.entries(statusMappings)) {
            if (remarks.includes(leadRemark)) {
                leadStatus = status;
                break;
            }
        }

        if (!leadStatus) {
            return res.status(400).json({ success: false, message: "Invalid leadRemark for status update" });
        }

        // Prepare the update object with leadStatus
        let updateData = { leadStatus };

        // Construct the update query
        let updateQuery = { $set: updateData };

        // If new comments exist, append them to the existing comments array
        if (comments) {
            updateQuery.$push = { comments: { $each: comments } };
        }

        // Update the contact, ensuring comments are appended instead of replaced
        let result = await Contact.updateOne(
            { _id: req.params.id },
            updateQuery
        );
        console.log(result)
        res.status(200).json(result);
    } catch (err) {
        console.error("Failed to Update Contact:", err);
        res.status(400).json({ error: "Failed to Update Contact" });
    }
};


const view = async (req, res) => {
    try {
        let contact = await Contact.findOne({ _id: req.params.id });
        let interestProperty = await Contact.findOne({ _id: req.params.id }).populate("interestProperty")

        if (!contact) return res.status(404).json({ message: 'No data found.' })
        let EmailHistory = await email.aggregate([
            { $match: { createByContact: contact._id } },
            {
                $lookup: {
                    from: 'Contacts', // Assuming this is the collection name for 'contacts'
                    localField: 'createByContact',
                    foreignField: '_id',
                    as: 'createByRef'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByRef', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
            { $match: { 'users.deleted': false } },
            {
                $addFields: {
                    senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    deleted: {
                        $cond: [
                            { $eq: ['$createByRef.deleted', false] },
                            '$createByRef.deleted',
                            { $ifNull: ['$createByrefLead.deleted', false] }
                        ]
                    },

                    createByName: {
                        $cond: {
                            if: '$createByRef',
                            then: { $concat: ['$createByRef.title', ' ', '$createByRef.firstName', ' ', '$createByRef.lastName'] },
                            else: { $concat: ['$createByrefLead.leadName'] }
                        }
                    },
                }
            },
            {
                $project: {
                    createByRef: 0,
                    createByrefLead: 0,
                    users: 0,
                }
            },
        ]);

        let phoneCallHistory = await phoneCall.aggregate([
            { $match: { createByContact: contact._id } },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'createByContact',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);
        let meetingHistory = await MeetingHistory.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $in: [contact._id, '$attendes'] },
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'attendes',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    attendesArray: '$contact.email',
                    createdByName: '$users.username',
                }
            },
            {
                $project: {
                    contact: 0,
                    users: 0
                }
            }
        ]);
        let textMsg = await TextMsg.aggregate([
            { $match: { createFor: contact._id } },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'createFor',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            { $unwind: '$contact' },
            { $match: { 'contact.deleted': false } },
            {
                $addFields: {
                    sender: '$users.username',
                    deleted: '$contact.deleted',
                    createByName: { $concat: ['$contact.title', ' ', '$contact.firstName', ' ', '$contact.lastName'] },
                }
            },
            {
                $project: { contact: 0, users: 0 }
            },
        ]);

        let task = await Task.aggregate([
            { $match: { assignTo: contact._id } },
            {
                $lookup: {
                    from: 'Contacts',
                    localField: 'assignTo',
                    foreignField: '_id',
                    as: 'contact'
                }
            },
            {
                $lookup: {
                    from: 'User',
                    localField: 'createBy',
                    foreignField: '_id',
                    as: 'users'
                }
            },
            { $unwind: { path: '$contact', preserveNullAndEmptyArrays: true } },
            { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    assignToName: '$contact.email',
                    createByName: '$users.username',
                }
            },
            { $project: { contact: 0, users: 0 } },
        ])

        const Document = await DocumentSchema.aggregate([
            { $unwind: '$file' },
            { $match: { 'file.deleted': false, 'file.linkContact': contact._id } },
            {
                $lookup: {
                    from: 'User', // Replace 'users' with the actual name of your users collection
                    localField: 'createBy',
                    foreignField: '_id', // Assuming the 'createBy' field in DocumentSchema corresponds to '_id' in the 'users' collection
                    as: 'creatorInfo'
                }
            },
            { $unwind: { path: '$creatorInfo', preserveNullAndEmptyArrays: true } },
            { $match: { 'creatorInfo.deleted': false } },
            {
                $group: {
                    _id: '$_id',  // Group by the document _id (folder's _id)
                    folderName: { $first: '$folderName' }, // Get the folderName (assuming it's the same for all files in the folder)
                    createByName: { $first: { $concat: ['$creatorInfo.firstName', ' ', '$creatorInfo.lastName'] } },
                    files: { $push: '$file' }, // Push the matching files back into an array
                }
            },
            { $project: { creatorInfo: 0 } },
        ]);

        res.status(200).json({ interestProperty, contact, EmailHistory, phoneCallHistory, meetingHistory, textMsg, task, Document });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error, err: 'An error occurred.' });
    }
}

const deleteData = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const contact = await Contact.deleteMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", contact })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

module.exports = { index, add, addPropertyInterest, view, edit, deleteData, deleteMany, addMany, changeStatus }