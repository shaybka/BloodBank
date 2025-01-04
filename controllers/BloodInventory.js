import BloodInventory from '../models/BloodInventoryModel.js';

// Create Blood Inventory
export const createBloodInventory = async (req, res) => {
    const { bloodType, quantity, storageLocation, expiryDate } = req.body;

    // Validate input
    if (!bloodType || quantity == null || !storageLocation || !expiryDate) {
        return res.status(400).json({ message: 'Please provide all required fields: bloodType, quantity, storageLocation, expiryDate.' });
    }

    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodTypes.includes(bloodType)) {
        return res.status(400).json({ message: 'Invalid blood type.' });
    }

    try {
        // Check if the combination of bloodType and storageLocation already exists
        const existingInventory = await BloodInventory.findOne({
            blood_type: bloodType,
            storage_location: storageLocation
        });

        if (existingInventory) {
            return res.status(400).json({ message: 'Blood inventory with this blood type and storage location already exists.' });
        }

        // Create new blood inventory
        const newInventory = new BloodInventory({
            blood_type: bloodType,
            quantity,
            storage_location: storageLocation,
            expiry_date: new Date(expiryDate)
        });

        await newInventory.save();

        res.status(201).json({
            message: 'Blood inventory created successfully.',
            inventory: newInventory
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get All Blood Inventory
export const getAllBloodInventory = async (req, res) => {
    try {
        const inventories = await BloodInventory.find();
        res.status(200).json({
            message: 'Blood inventory retrieved successfully.',
            inventories
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Blood Inventory by Blood Type
export const getBloodInventoryByType = async (req, res) => {
    const { bloodType } = req.params;

    try {
        const inventory = await BloodInventory.findOne({ blood_type: bloodType });
        if (!inventory) {
            return res.status(404).json({ message: 'Blood type not found in inventory.' });
        }

        res.status(200).json({
            message: 'Blood inventory retrieved successfully.',
            inventory
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};



// Update Blood Inventory
export const updateBloodInventory = async (req, res) => {
    const { id } = req.params;
    const { quantity, storageLocation, expiryDate } = req.body;

    try {
        let inventory = await BloodInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: 'Blood inventory not found.' });
        }

        if (quantity != null) inventory.quantity = quantity;
        if (storageLocation) inventory.storage_location = storageLocation;
        if (expiryDate) inventory.expiry_date = new Date(expiryDate);

        await inventory.save();

        res.status(200).json({
            message: 'Blood inventory updated successfully.',
            inventory
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete Blood Inventory
export const deleteBloodInventory = async (req, res) => {
    const { id } = req.params;

    try {
        const inventory = await BloodInventory.findById(id);
        if (!inventory) {
            return res.status(404).json({ message: 'Blood inventory not found.' });
        }

        await BloodInventory.findByIdAndDelete(id);

        res.status(200).json({ message: 'Blood inventory deleted successfully.' });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};



