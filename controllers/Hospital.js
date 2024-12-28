import Hospital from '../models/Hospitals.js';

// Register Hospital
export const registerHospital = async (req, res) => {
    const { name, location, contact_info } = req.body;

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
            }
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

// Update Hospital
export const updateHospital = async (req, res) => {
    const { id } = req.params;
    const { name, location, contact_info } = req.body;

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

// Delete Hospital
export const deleteHospital = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the hospital by ID
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
        res.status(200).json({
            message: 'Hospitals retrieved successfully',
            hospitals
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Verify Hospital
export const verifyHospital = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the hospital by ID
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        if (hospital.partner_status === "verified") {
            return res.status(400).json({ message: 'Hospital is already verified.' });
        }

        // Update partner_status to "verified"
        hospital.partner_status = "verified";
        await hospital.save();

        res.status(200).json({
            message: 'Hospital verified successfully.',
            hospital
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};


// Get Single Hospital by ID
export const getHospitalById = async (req, res) => {
    const { id } = req.params;

    try {
        const hospital = await Hospital.findById(id);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        res.status(200).json({
            message: 'Hospital retrieved successfully',
            hospital
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};