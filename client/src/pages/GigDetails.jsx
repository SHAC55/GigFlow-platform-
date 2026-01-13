import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useGig } from "../context/GigContext";
import toast from "react-hot-toast";
import {
  CheckCircle,
  Clock,
  DollarSign,
  MessageSquare,
  User,
  Award,
  XCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function GigDetails() {
  const { id } = useParams();
  const { placeBid, getBidsByGig, bids, hireBid } = useGig();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  useEffect(() => {
    loadBids();
  }, [id]);

  const loadBids = async () => {
    setLoading(true);
    await getBidsByGig(id);
    setLoading(false);
  };

  const gigAssigned = bids.some((b) => b.status === "hired");

  const isGigOwner = bids.some(
  (b) =>
    String(b.gigId?.ownerId?._id || b.gigId?.ownerId) ===
    String(user?._id)
);


  const disableBidForm = gigAssigned || isGigOwner;

  const onSubmit = async (data) => {
    const ok = await placeBid({ ...data, gigId: id });
    if (ok) {
      reset();
      loadBids();
      toast.success("Bid placed successfully!");
    }
  };

  const handleHire = async (bidId) => {
    const ok = await hireBid(bidId);
    if (ok) {
      loadBids();
      toast.success("Freelancer hired successfully!");
    }
  };

  useEffect(() => {
  if (bids.length) {
    console.log("USER:", user?._id);
    console.log("OWNER:", bids[0]?.gigId?.ownerId);
  }
}, [bids]);


  const getStatusIcon = (status) => {
    switch (status) {
      case "hired":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Bid Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6">
                <Award className="w-8 h-8 text-blue-600" />
                <h3 className="text-2xl font-bold text-gray-900">
                  Place Your Bid
                </h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Proposal Message</span>
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      disableBidForm
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                    placeholder="Describe your approach..."
                    rows={4}
                    disabled={disableBidForm}
                    {...register("message", {
                      required: "Proposal message is required",
                      minLength: {
                        value: 20,
                        message: "Please write at least 20 characters",
                      },
                    })}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Your Price (₹)</span>
                  </label>
                  <input
                    type="number"
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      disableBidForm
                        ? "bg-gray-100 cursor-not-allowed"
                        : "bg-white"
                    }`}
                    placeholder="Enter amount"
                    disabled={disableBidForm}
                    {...register("price", {
                      required: "Price is required",
                      min: { value: 1, message: "Minimum price is ₹1" },
                    })}
                  />
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.price.message}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || disableBidForm}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all ${
                    disableBidForm
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                  }`}
                >
                  {isGigOwner
                    ? "You posted this gig"
                    : gigAssigned
                    ? "🎉 Position Filled"
                    : isSubmitting
                    ? "Sending Bid..."
                    : "Submit Bid →"}
                </button>
              </form>
            </div>
          </div>

          {/* Right Column - Bids */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h3 className="text-2xl font-bold text-gray-900">All Bids</h3>
                <p className="text-gray-600 mt-1">
                  {bids.length} proposals
                </p>
              </div>

              {loading ? (
                <div className="p-10 text-center">Loading...</div>
              ) : bids.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  No bids yet
                </div>
              ) : (
                <div className="divide-y">
                  {bids.map((b) => (
                    <div key={b._id} className="p-6 flex justify-between gap-4">
                      <div>
                        <h4 className="font-bold">
                          {b.freelancerId?.name || "Freelancer"}
                        </h4>
                        <p className="mt-2">{b.message}</p>
                        <p className="mt-2 font-semibold">₹{b.price}</p>
                        <div className="mt-2 flex items-center gap-2">
                          {getStatusIcon(b.status)}
                          <span className="text-sm">{b.status}</span>
                        </div>
                      </div>

                      {/* Only owner can hire */}
                      {b.status === "pending" &&
                        !gigAssigned &&
                        isGigOwner && (
                          <button
                            onClick={() => handleHire(b._id)}
                            className="bg-green-600 text-white px-5 py-2 rounded-lg"
                          >
                            Hire Now
                          </button>
                        )}

                      {b.status === "hired" && (
                        <span className="text-green-600 font-semibold">
                          Hired
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
