import Donation from '../models/DonationModel.js';
import Donor from '../models/DonorModel.js';
import BloodInventory from '../models/BloodInventoryModel.js';

// Make a Donation
export const makeDonation = async (req, res) => {
    const { donorId, bloodType, quantity, location, notes } = req.body;

    if (!donorId || !bloodType || !quantity || !location) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    try {
        // Verify Donor exists
        const donor = await Donor.findById(donorId);
        if (!donor) {
            return res.status(404).json({ message: 'Donor not found.' });
        }

        // Create Donation
        const donation = new Donation({
            donor_id: donorId,
            blood_type: bloodType,
            quantity,
            location,
            notes
        });

        await donation.save();

        // Update Donor's Donation History
        donor.donationHistory.push({
            donation_id: donation._id,
            date: donation.donation_date,
            quantity,
            location
        });

        await donor.save();

        // Update Blood Inventory
        let inventory = await BloodInventory.findOne({ blood_type: bloodType });
        if (inventory) {
            inventory.quantity += quantity;
            await inventory.save();
        } else {
            // If inventory for blood type doesn't exist, create it
            inventory = new BloodInventory({
                blood_type: bloodType,
                quantity,
                storage_location: location,
                expiry_date: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000) // 42 days from now
            });
            await inventory.save();
        }

        res.status(201).json({
            message: 'Donation made successfully.',
            donation
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get count of all donations
export const getDonationCount = async (req, res) => {
  try {
    const count = await Donation.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

export const getAllDonations = async (req, res) => {
    try {
        // Populate 'donor_id' with the donor's 'name'
        const donations = await Donation.find().populate('donor_id', 'name');

        res.status(200).json({
            message: 'Donations retrieved successfully',
            donations
        });
    } catch (error) {
        console.error(`Error fetching donations: ${error.message}`);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Donation by ID
export const getDonationById = async (req, res) => {
    const { id } = req.params;

    try {
        const donation = await Donation.findById(id).populate('donor_id', 'name email');
        if (!donation) {
            return res.status(404).json({ message: 'Donation not found.' });
        }

        res.status(200).json({
            message: 'Donation retrieved successfully.',
            donation
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};