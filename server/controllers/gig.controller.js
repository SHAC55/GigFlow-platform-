import gigModel from "../models/gigModel.js";

export const getGigs = async (req, res) => {
  try {
    const search = req.query.search || "";

    const gigs = await gigModel.find({
      status: "open",
      title: { $regex: search, $options: "i" },
    }).sort({ createdAt: -1 });

    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createGig = async (req, res) => {
  try {
    const { title, description, budget } = req.body;

    const gig = await gigModel.create({
      title,
      description,
      budget,
      ownerId: req.user.id,
    });

    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
