
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
  XCircle
} from "lucide-react";

export default function GigDetails() {
  const { id } = useParams();
  const { placeBid, getBidsByGig, bids, hireBid } = useGig();
  const [gigAssigned, setGigAssigned] = useState(false);
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
    const hired = bids?.some((b) => b.status === "hired");
    setGigAssigned(hired);
    setLoading(false);
  };

  const onSubmit = async (data) => {
    await placeBid({ ...data, gigId: id });
    reset();
    loadBids();
    toast.success("Bid placed successfully!");
  };

  const handleHire = async (bidId) => {
    await hireBid(bidId);
    loadBids();
    toast.success("Freelancer hired successfully!");
  };

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
                <h3 className="text-2xl font-bold text-gray-900">Place Your Bid</h3>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare className="w-4 h-4" />
                    <span>Proposal Message</span>
                  </label>
                  <textarea
                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      gigAssigned ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                    }`}
                    placeholder="Describe your approach and why you're the best fit..."
                    rows={4}
                    disabled={gigAssigned}
                    {...register("message", { 
                      required: "Proposal message is required",
                      minLength: {
                        value: 20,
                        message: "Please write at least 20 characters"
                      }
                    })}
                  />
                  {errors.message && (
                    <p className="mt-2 text-sm text-red-600">{errors.message.message}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <DollarSign className="w-4 h-4" />
                    <span>Your Price (₹)</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                    <input
                      type="number"
                      className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        gigAssigned ? "bg-gray-100 cursor-not-allowed" : "bg-white"
                      }`}
                      placeholder="Enter your bid amount"
                      disabled={gigAssigned}
                      {...register("price", {
                        required: "Price is required",
                        min: { value: 1, message: "Minimum price is ₹1" },
                        max: { value: 1000000, message: "Maximum price is ₹1,000,000" }
                      })}
                    />
                  </div>
                  {errors.price && (
                    <p className="mt-2 text-sm text-red-600">{errors.price.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || gigAssigned}
                  className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                    gigAssigned
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  }`}
                >
                  {gigAssigned
                    ? "🎉 Position Filled"
                    : isSubmitting
                    ? "Sending Bid..."
                    : "Submit Bid →"}
                </button>
                
                {gigAssigned && (
                  <p className="text-center text-sm text-gray-500 mt-4">
                    This position has been filled and is no longer accepting bids.
                  </p>
                )}
              </form>
            </div>
          </div>

          {/* Right Column - Bids List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900">All Bids</h3>
                <p className="text-gray-600 mt-1">
                  {bids.length} {bids.length === 1 ? 'proposal' : 'proposals'} received
                </p>
              </div>

              {loading ? (
                <div className="p-12 text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <p className="mt-4 text-gray-500">Loading bids...</p>
                </div>
              ) : bids.length === 0 ? (
                <div className="p-12 text-center">
                  <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
                  <h4 className="mt-4 text-xl font-semibold text-gray-700">No bids yet</h4>
                  <p className="mt-2 text-gray-500">Be the first to submit a proposal!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {bids.map((b) => (
                    <div
                      key={b._id}
                      className={`p-6 hover:bg-gray-50 transition-colors ${
                        b.status === "hired" ? "bg-green-50" : ""
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="font-bold text-gray-900">
                                {b.freelancerId?.name || "Anonymous"}
                              </h4>
                              <p className="text-sm text-gray-500">Freelancer</p>
                            </div>
                          </div>
                          
                          <p className="mt-4 text-gray-700">{b.message}</p>
                          
                          <div className="flex flex-wrap items-center gap-4 mt-4">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-bold text-lg text-gray-900">
                                ₹{b.price}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(b.status)}
                              <span className={`text-sm font-medium px-3 py-1 rounded-full ${
                                b.status === "hired"
                                  ? "bg-green-100 text-green-800"
                                  : b.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}>
                                {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        {b.status === "pending" && !gigAssigned && (
                          <button
                            onClick={() => handleHire(b._id)}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 whitespace-nowrap"
                          >
                            Hire Now
                          </button>
                        )}
                        
                        {b.status === "hired" && (
                          <div className="flex items-center space-x-2 text-green-600">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-semibold">Hired</span>
                          </div>
                        )}
                      </div>
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