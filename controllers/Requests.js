import Request from '../models/RequestsModel.js';
import Hospital from '../models/Hospitals.js';
import BloodInventory from '../models/BloodInventoryModel.js';

// Get count of all requests
export const getRequestCount = async (req, res) => {
  try {
    const count = await Request.countDocuments();
    res.status(200).json({ count });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: `Server error: ${error.message}` });
  }
};

// Create a Blood Request
export const createRequest = async (req, res) => {
    const { hospitalId, bloodType, quantity } = req.body;

    if (!hospitalId || !bloodType || !quantity) {
        return res.status(400).json({ message: 'Please provide all required fields: hospitalId, bloodType, quantity.' });
    }

    // Validate blood type
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    if (!validBloodTypes.includes(bloodType)) {
        return res.status(400).json({ message: 'Invalid blood type.' });
    }

    try {
        // Verify Hospital exists
        const hospital = await Hospital.findById(hospitalId);
        if (!hospital) {
            return res.status(404).json({ message: 'Hospital not found.' });
        }

        // Check Blood Inventory availability
        const inventory = await BloodInventory.findOne({ blood_type: bloodType });
        if (!inventory || inventory.quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient blood inventory for the requested blood type.' });
        }

        // Create Request
        const newRequest = new Request({
            hospital_id: hospitalId,
            blood_type: bloodType,
            quantity
        });

        await newRequest.save();

        res.status(201).json({
            message: 'Blood request created successfully.',
            request: newRequest
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get All Blood Requests
export const getAllRequests = async (req, res) => {
    try {
        const requests = await Request.find().populate('hospital_id', 'name location');
        res.status(200).json({
            message: 'Blood requests retrieved successfully.',
            requests
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Get Request by ID
export const getRequestById = async (req, res) => {
    const { id } = req.params;

    try {
        const request = await Request.findById(id).populate('hospital_id', 'name location');
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        res.status(200).json({
            message: 'Blood request retrieved successfully.',
            request
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Update Blood Request
export const updateRequest = async (req, res) => {
    const { id } = req.params;
    const { hospitalId, bloodType, quantity, status } = req.body;

    const validStatuses = ["pending", "completed", "cancelled"];
    const validBloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

    if (status && !validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value.' });
    }

    if (bloodType && !validBloodTypes.includes(bloodType)) {
        return res.status(400).json({ message: 'Invalid blood type.' });
    }

    try {
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        if (hospitalId) {
            const hospital = await Hospital.findById(hospitalId);
            if (!hospital) {
                return res.status(404).json({ message: 'Hospital not found.' });
            }
            request.hospital_id = hospitalId;
        }

        if (bloodType) request.blood_type = bloodType;
        if (quantity) request.quantity = quantity;
        if (status) request.status = status;

        if (status === "completed") {
            // Deduct from Blood Inventory
            const inventory = await BloodInventory.findOne({ blood_type: request.blood_type });
            if (inventory && inventory.quantity >= request.quantity) {
                inventory.quantity -= request.quantity;
                await inventory.save();
                request.completion_date = new Date();
            } else {
                return res.status(400).json({ message: 'Insufficient blood inventory to complete the request.' });
            }
        }

        await request.save();

        res.status(200).json({
            message: 'Blood request updated successfully.',
            request
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};

// Delete Blood Request
export const deleteRequest = async (req, res) => {
    const { id } = req.params;

    try {
        const request = await Request.findById(id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }

        await Request.findByIdAndDelete(id);

        res.status(200).json({ message: 'Blood request deleted successfully.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};