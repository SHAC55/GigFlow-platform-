import express from "express";
import { createBid, getBidsByGig, hireBid } from "../controllers/bid.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";


const bidRoutes = express.Router();

bidRoutes.post("/", authMiddleware, createBid);
bidRoutes.get("/:gigId", authMiddleware, getBidsByGig);
bidRoutes.patch("/:bidId/hire", authMiddleware, hireBid);

export default bidRoutes;
