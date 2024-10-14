import Group from '../models/Group.js';

export const createGroup = async (req, res) => {
    try {
        const group = new Group(req.body);
        const savedGroup = await group.save();
        res.status(201).json(savedGroup);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
};