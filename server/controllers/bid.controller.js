import { io } from "../server.js";
import bidModel from "../models/bidModel.js";
import gigModel from "../models/gigModel.js";

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
    const bids = await bidModel
      .find({ gigId: req.params.gigId })
      .populate("freelancerId", "name email")
      .populate("gigId", "ownerId status"); // ✅ THIS LINE FIXES EVERYTHING

    res.json(bids);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const hireBid = async (req, res) => {
  try {
    const userId = req.user.id;

    const bid = await bidModel.findById(req.params.bidId).populate("gigId");

    if (!bid) return res.status(404).json({ message: "Bid not found" });

    if (bid.gigId.ownerId.toString() !== userId) {
      return res.status(403).json({ message: "Only gig owner can hire" });
    }

    if (bid.status === "hired") {
      return res.status(400).json({ message: "Already hired" });
    }

    const alreadyHired = await bidModel.findOne({
      gigId: bid.gigId._id,
      status: "hired",
    });

    if (alreadyHired) {
      return res.status(400).json({ message: "Gig already assigned" });
    }

    bid.status = "hired";
    await bid.save();

    await bidModel.updateMany(
      { gigId: bid.gigId._id, _id: { $ne: bid._id } },
      { status: "rejected" }
    );

    // console.log(bid.freelancerId)
    io.to(bid.freelancerId.toString()).emit("hired", {
      message: "🎉 You have been hired for a gig!",
      gigId: bid.gigId._id,
      gigTitle: bid.gigId.title || "New Gig",
    });

 

    const updatedGig = await gigModel.findByIdAndUpdate(
      bid.gigId._id,
      { status: "assigned" },
      { new: true }
    );

    res.json({ success: true, bid });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
