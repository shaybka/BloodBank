import Donor from '../models/DonorModel.js';
// import Donation from '../models/DonationModel.js';




// Get All Donation Histories
export const getAllDonationHistories = async (req, res) => {
    try {
        // Fetch all donors and populate their donation histories
        const donors = await Donor.find()
            .populate({
                path: 'donationHistory.donation_id',
                select: 'blood_type quantity donation_date location notes'
            });

        res.status(200).json({
            message: 'Donation histories retrieved successfully',
            donationHistories: donors.map(donor => ({
                donorName: donor.name,
                donations: donor.donationHistory.map(history => history.donation_id)
            }))
        });
    } catch (error) {
        console.error(`Error fetching donation histories: ${error.message}`);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

export const createDonor = async (req, res) => {
    const { name, age, bloodGroup, phone, email, address } = req.body;

    // Validate input
    if (!name || !age || !bloodGroup || !phone || !email || !address) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Check if donor already exists
        const existingDonor = await Donor.findOne({
            $or: [
                { email: email.toLowerCase() },
                { phone: phone }
            ]
        });

        if (existingDonor) {
            return res.status(400).json({ message: 'Donor with the same email or phone already exists.' });
        }

        // Create new donor
        const newDonor = new Donor({
            name,
            age,
            bloodGroup,
            phone,
            email: email.toLowerCase(),
            address
        });

        await newDonor.save();

        res.status(201).json({
            message: 'Donor created successfully',
            donor: newDonor
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get All Donors 
export const getAllDonors = async (req, res) => {
    try {
        const donors = await Donor.find();
        res.status(200).json({
            message: 'Donors retrieved successfully',
            donors
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Donor by ID 
export const getDonorById = async (req, res) => {
    const { id } = req.params;

    try {
        const donor = await Donor.findById(id)
            .populate('donationHistory.donation_id', 'blood_type quantity donation_date location notes');
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found.' });
        }

        res.status(200).json({
            message: 'Donor retrieved successfully',
            donor
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Update Donor 
export const updateDonor = async (req, res) => {
    const { id } = req.params;
    const { name, age, bloodGroup, phone, email, address, donationHistory } = req.body;

    try {
        // Find the donor by ID
        let donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found.' });
        }

        // Update fields if provided
        if (name) donor.name = name;
        if (age) donor.age = age;
        if (bloodGroup) donor.bloodGroup = bloodGroup;
        if (phone) donor.phone = phone;
        if (email) donor.email = email.toLowerCase();
        if (address) donor.address = address;
        if (donationHistory) donor.donationHistory = donationHistory;

        await donor.save();

        res.status(200).json({
            message: 'Donor updated successfully',
            donor
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete Donor
export const deleteDonor = async (req, res) => {
    const { id } = req.params;

    try {
        const donor = await Donor.findById(id);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found.' });
        }

        await Donor.findByIdAndDelete(id);

        res.status(200).json({ message: 'Donor deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};