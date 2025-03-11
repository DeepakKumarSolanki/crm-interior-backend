const { Lead } = require('../../model/schema/lead')
const email = require('../../model/schema/email');
const PhoneCall = require('../../model/schema/phoneCall');
const Task = require('../../model/schema/task')
const MeetingHistory = require('../../model/schema/meeting')
const DocumentSchema = require('../../model/schema/document')

const index = async (req, res) => {
    const query = req.query
    query.deleted = false;

    // let result = await Lead.find(query)

    let allData = await Lead.find(query).populate({
        path: 'createBy',
        match: { deleted: false } // Populate only if createBy.deleted is false
    }).exec()

    const result = allData.filter(item => item.createBy !== null);
    res.send(result)
}

const addMany = async (req, res) => {
    try {
        const data = req.body;
        const insertedLead = await Lead.insertMany(data);

        res.status(200).json(insertedLead);
    } catch (err) {
        console.error('Failed to create Lead :', err);
        res.status(400).json({ error: 'Failed to create Lead' });
    }
};

const changeStatus = async (req, res) => {
    try {
        // Get the name value from the request
        const { name } = req.body;  
        let leadStatus;

        // logic to set the lead status based on name
        if (["Wants Interior After 90 Days", "Budget is Less Than 10 Lakhs", "Possesion More Than 90 Days",  "Currenlty Not Interested", "RNR","Busy","Move in Criteria More Than 120 Days"].includes(name)) {
            leadStatus = "cold";
        } else if (["Follow Up", "Site Visit Schedule", "Site Visit Reschedule", "Video Call Schedule", "Video Call Reschedule","Office Meeting Schedule","Office Meeting Reschedule","Wants Interior Within 60-90 Days","Budget is More Than 10 Lakhs","Possesion Within 60-90 Days","Move in Criteria Within 60-90 Days"].includes(name)) {
            leadStatus = "warm";
        } else if (["Wants Interior Within A Month", "Budget is More Than 30 Lakhs", "Possesion Within 45-60 Days", "Move-In Criteria Within 30-60 Days"].includes(name)) {
            leadStatus = "hot";
        }
            else if(["Out of Bangalore","Not Looking For Interior","Not Purchased House","Interior Already Done","Budget is Less Than 3 Lakhs","Incorrect Contact Details","Lead Lost"].includes(name)){
            leadstatus = "junk"
        } else {
            return res.status(400).json({ success: false, message: "Invalid name for status update" });
        }

        // Update the lead's status
        const result = await Lead.findOneAndUpdate(
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

const add = async (req, res) => {
    console.log(req.body,"lead..................................................")
    try {
        req.body.createdDate = new Date();
        const user = new Lead(req.body);
        await user.save();
        res.status(200).json(user);
    } catch (err) {
        console.error('Failed to create Lead:', err);
        res.status(400).json({ error: 'Failed to create Lead' });
    }
}

const edit = async (req, res) => {
    try {
        let result = await Lead.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        res.status(200).json(result);
    } catch (err) {
        console.error('Failed to Update Lead:', err);
        res.status(400).json({ error: 'Failed to Update Lead' });
    }
}

const view = async (req, res) => {
    let lead = await Lead.findOne({ _id: req.params.id })
    if (!lead) return res.status(404).json({ message: "no Data Found." })

    let query = req.query
    if (query.sender) {
        query.sender = new mongoose.Types.ObjectId(query.sender);
    }
    query.createByLead = req.params.id

    let Email = await email.aggregate([
        { $match: { createByLead: lead._id } },
        {
            $lookup: {
                from: 'Leads', // Assuming this is the collection name for 'leads'
                localField: 'createByLead',
                foreignField: '_id',
                as: 'createByrefLead'
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
                users: 0
            }
        },
    ])

    let phoneCall = await PhoneCall.aggregate([
        { $match: { createByLead: lead._id } },
        {
            $lookup: {
                from: 'Leads', // Assuming this is the collection name for 'leads'
                localField: 'createByLead',
                foreignField: '_id',
                as: 'createByrefLead'
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
        { $unwind: { path: '$createByrefLead', preserveNullAndEmptyArrays: true } },
        { $match: { 'users.deleted': false } },
        {
            $addFields: {
                senderName: { $concat: ['$users.firstName', ' ', '$users.lastName'] },
                deleted: '$createByrefLead.deleted',
                createByName: '$createByrefLead.leadName',
            }
        },
        { $project: { createByrefLead: 0, users: 0 } },
    ])

    let task = await Task.aggregate([
        { $match: { assignToLead: lead._id } },
        {
            $lookup: {
                from: 'Leads',
                localField: 'assignToLead',
                foreignField: '_id',
                as: 'lead'
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
        { $unwind: { path: '$lead', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: true } },
        {
            $addFields: {
                // assignToName: lead.leadName, 
                assignToName: '$lead.leadName',
                createByName: '$users.username',
            }
        },
        { $project: { lead: 0, users: 0 } },
    ])

    let meeting = await MeetingHistory.aggregate([
        {
            $match: {
                $expr: {
                    $and: [
                        { $in: [lead._id, '$attendesLead'] },
                    ]
                }
            }
        },
        {
            $lookup: {
                from: 'Leads',
                localField: 'assignToLead',
                foreignField: '_id',
                as: 'lead'
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
                attendesArray: '$lead.leadEmail',
                createdByName: '$users.username',
            }
        },
        {
            $project: {
                users: 0
            }
        }
    ]);
    const Document = await DocumentSchema.aggregate([
        { $unwind: '$file' },
        { $match: { 'file.deleted': false, 'file.linkLead': lead._id } },
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

    res.status(200).json({ lead, Email, phoneCall, task, meeting, Document })
}

const deleteData = async (req, res) => {
    try {
        const lead = await Lead.findByIdAndDelete(req.params.id, { deleted: true });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}

const deleteMany = async (req, res) => {
    try {
        const lead = await Lead.deleteMany({ _id: { $in: req.body } }, { $set: { deleted: true } });
        res.status(200).json({ message: "done", lead })
    } catch (err) {
        res.status(404).json({ message: "error", err })
    }
}


module.exports = { index, add, addMany, view, edit, deleteData, deleteMany, changeStatus }