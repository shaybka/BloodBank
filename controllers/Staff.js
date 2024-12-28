import Staff from '../models/StaffModel.js';

// Create a Staff Member
export const createStaff = async (req, res) => {
    const { name, role, phone, email, address } = req.body;

    // Validate input
    if (!name || !role || !phone || !email || !address) {
        return res.status(400).json({ message: 'Please provide all required fields: name, role, phone, email, address.' });
    }

    try {
        // Check if staff with the same email or phone already exists
        const existingStaff = await Staff.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: phone }
            ]
        });

        if (existingStaff) {
            return res.status(400).json({ message: 'Staff with the same email or phone already exists.' });
        }

        // Create new staff member
        const newStaff = new Staff({
            name,
            role,
            phone,
            email: email.toLowerCase(),
            address
        });

        await newStaff.save();

        res.status(201).json({
            message: 'Staff member created successfully.',
            staff: newStaff
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get All Staff Members
export const getAllStaff = async (req, res) => {
    try {
        const staffMembers = await Staff.find();
        res.status(200).json({
            message: 'Staff members retrieved successfully.',
            staff: staffMembers
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Staff Member by ID
export const getStaffById = async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found.' });
        }

        res.status(200).json({
            message: 'Staff member retrieved successfully.',
            staff
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Update Staff Member
export const updateStaff = async (req, res) => {
    const { id } = req.params;
    const { name, role, phone, email, address } = req.body;

    try {
        let staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found.' });
        }

        // Check for duplicate email or phone if they are being updated
        if (email || phone) {
            const duplicate = await Staff.findOne({
                $or: [
                    { email: email ? email.toLowerCase() : undefined },
                    { phone: phone }
                ],
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(400).json({ message: 'Another staff member with the same email or phone already exists.' });
            }
        }

        // Update fields
        if (name) staff.name = name;
        if (role) staff.role = role;
        if (phone) staff.phone = phone;
        if (email) staff.email = email.toLowerCase();
        if (address) staff.address = address;

        await staff.save();

        res.status(200).json({
            message: 'Staff member updated successfully.',
            staff
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete Staff Member
export const deleteStaff = async (req, res) => {
    const { id } = req.params;

    try {
        const staff = await Staff.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff member not found.' });
        }

        await Staff.findByIdAndDelete(id);

        res.status(200).json({ message: 'Staff member deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};