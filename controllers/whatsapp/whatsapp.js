const WhatsApp = require('../../model/schema/whatsApp')
// const mongoose = require('mongoose');

const addMessage = async (req, res) => {
    try {
        const { sender, recipient, recipientNumber, message, startDate, createBy, createByLead } = req.body;

        if (!sender || !recipientNumber || !message || !startDate || !createBy) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newMessage = new WhatsApp({
            sender,
            recipient,
            recipientNumber,
            message,
            startDate,
            createBy,
            createByLead,
        });

        await newMessage.save();
        return res.status(201).json({ message: 'WhatsApp message added successfully', data: newMessage });

    } catch (error) {
        console.error('Error adding message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

//Get all WhatsApp messages with recipient name & phone number
const getAllMessages = async (req, res) => {
    try {
        const messages = await WhatsApp.find()
            .populate('createBy', 'firstName lastName') 
            .populate('sender')
            .populate('recipient') 
            .select('sender recipient recipientNumber message startDate createBy createByLead'); // Select necessary fields

        return res.status(200).json({ data: messages });
    } catch (error) {
        console.error('Error fetching messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


// single WhatsApp message by ID
const getMessageById = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await WhatsApp.findById(id).populate('createBy', 'firstName lastName').populate('createByLead');

        if (!message) {
            return res.status(404).json({ message: 'Message not found' });
        }

        return res.status(200).json({ data: message });
    } catch (error) {
        console.error('Error fetching message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};


const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedMessage = await WhatsApp.findByIdAndDelete(id);

        if (!deletedMessage) {
            return res.status(404).json({ message: 'Message not found' });
        }

        return res.status(200).json({ message: 'WhatsApp message deleted successfully' });
    } catch (error) {
        console.error('Error deleting message:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const deleteManyMessages = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ message: 'Invalid request, no IDs provided' });
        }

        const deletedMessages = await WhatsApp.deleteMany({ _id: { $in: ids } });

        if (deletedMessages.deletedCount === 0) {
            return res.status(404).json({ message: 'No messages found for deletion' });
        }

        return res.status(200).json({ message: 'Selected messages deleted successfully' });
    } catch (error) {
        console.error('Error deleting multiple messages:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {
    addMessage,
    getAllMessages,
    getMessageById,
    deleteMessage,
    deleteManyMessages,
};
