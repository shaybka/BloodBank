import Hospital from '../models/Hospitals.js';

// Update Hospital
export const updateHospital = async (req, res) => {
    const { id } = req.params;
    const { name, location, contact_info, partner_status } = req.body;

    // Validate required fields
    if (!name && !location && !contact_info && !partner_status) {
        return res.status(400).json({ message: 'Please provide at least one field to update: name, location, contact_info, or partner_status.' });
    }

    // Validate email format if provided
    if (contact_info && contact_info.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(contact_info.email)) {
            return res.status(400).json({ message: 'Invalid email format.' });
        }
    }

    try {
        // Find the hospital by ID
        let hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        // Check for duplicate name or email if they are being updated
        if (name || (contact_info && contact_info.email)) {
            const duplicate = await Hospital.findOne({
                $or: [
                    { name: name ? name.toLowerCase() : undefined },
                    { 'contact_info.email': contact_info && contact_info.email ? contact_info.email.toLowerCase() : undefined }
                ],
                _id: { $ne: id }
            });

            if (duplicate) {
                return res.status(400).json({ message: 'Another hospital with the same name or email already exists.' });
            }
        }

        // Update fields
        if (name) hospital.name = name.toLowerCase();
        if (location) hospital.location = location;
        if (contact_info) {
            if (contact_info.phone) hospital.contact_info.phone = contact_info.phone;
            if (contact_info.email) hospital.contact_info.email = contact_info.email.toLowerCase();
        }
        if (partner_status) hospital.partner_status = partner_status;

        await hospital.save();

        res.status(200).json({
            message: 'Hospital updated successfully',
            hospital
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Register Hospital
export const registerHospital = async (req, res) => {
    const { name, location, contact_info, partner_status } = req.body;

    // Validate input
    if (!name || !location || !contact_info || !contact_info.phone || !contact_info.email) {
        return res.status(400).json({ message: 'Please provide all required fields: name, location, contact_info.phone, contact_info.email.' });
    }

    try {
        // Check if hospital already exists by name or email
        const existingHospital = await Hospital.findOne({
            $or: [
                { name: name.toLowerCase() },
                { 'contact_info.email': contact_info.email.toLowerCase() }
            ]
        });

        if (existingHospital) {
            return res.status(400).json({ message: 'Hospital with the same name or email already exists.' });
        }

        // Create a new hospital
        const newHospital = new Hospital({
            name: name.toLowerCase(),
            location,
            contact_info: {
                phone: contact_info.phone,
                email: contact_info.email.toLowerCase()
            },
            partner_status: partner_status || 'unverified'
        });

        await newHospital.save();

        res.status(201).json({
            message: 'Hospital registered successfully',
            hospital: newHospital
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Check for duplicate hospital name or email
export const checkDuplicateHospital = async (req, res) => {
    const { name, email, id } = req.body;

    try {
        const duplicate = await Hospital.findOne({
            $or: [
                { name: name.toLowerCase() },
                { 'contact_info.email': email.toLowerCase() }
            ],
            _id: { $ne: id }
        });

        res.status(200).json({ isDuplicate: !!duplicate });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete Hospital
export const deleteHospital = async (req, res) => {
    const { id } = req.params;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        await Hospital.findByIdAndDelete(id);

        res.status(200).json({ message: 'Hospital deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get All Hospitals
export const getAllHospitals = async (req, res) => {
    try {
        const hospitals = await Hospital.find();
        res.status(200).json({ hospitals });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Hospital By ID
export const getHospitalById = async (req, res) => {
    const { id } = req.params;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        res.status(200).json({ hospital });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};