import bidModel from '../models/bidModel.js'
import gigModel from '../models/gigModel.js';
import mongoose from "mongoose";

export const createBid = async (req, res) => {
  try {
    const { gigId, message, price } = req.body;

    const bid = await bidModel.create({
      gigId,
      freelancerId: req.user.id,
      message,
      price,
    });

    res.status(201).json(bid);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBidsByGig = async (req, res) => {
  try {
    const bids = await bidModel.find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email");

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const hireBid = async (req, res) => {
  try {
    const bid = await bidModel.findById(req.params.bidId);
    if (!bid) return res.status(404).json({ message: "Bid not found" });

    const gig = await gigModel.findOneAndUpdate(
      { _id: bid.gigId, status: "open" }, 
      { status: "assigned" },
      { new: true }
    );

    if (!gig) {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    // mark selected bid hired
    await bidModel.findByIdAndUpdate(bid._id, { status: "hired" });

    // reject others
    await bidModel.updateMany(
      { gigId: gig._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    res.json({ message: "Freelancer hired successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

