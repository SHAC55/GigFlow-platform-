
import { useForm } from "react-hook-form";
import { useGig } from "../context/GigContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Briefcase, FileText, DollarSign, Upload, Sparkles } from "lucide-react";

export default function PostGig() {
  const { createGig } = useGig();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      await createGig(data);
      navigate("/");
      toast.success("🎉 Gig posted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to post gig");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Post a New Gig
          </h1>
          <p className="text-gray-600">
            Fill in the details below to find the perfect freelancer for your project
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Title */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
                <span>Project Title</span>
              </label>
              <input
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                placeholder="e.g., Need a React Native Developer for Mobile App"
                {...register("title", { 
                  required: "Title is required",
                  minLength: {
                    value: 10,
                    message: "Title should be at least 10 characters"
                  }
                })}
              />
              {errors.title && (
                <p className="mt-3 text-sm text-red-600 font-medium">{errors.title.message}</p>
              )}
              <p className="mt-2 text-sm text-gray-500">
                Be specific about what you need
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <FileText className="w-6 h-6 text-green-600" />
                <span>Project Description</span>
              </label>
              <textarea
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all min-h-[200px]"
                placeholder="Describe your project in detail. Include requirements, goals, and any specific technologies needed..."
                {...register("description", { 
                  required: "Description is required",
                  minLength: {
                    value: 50,
                    message: "Please provide at least 50 characters"
                  }
                })}
              />
              {errors.description && (
                <p className="mt-3 text-sm text-red-600 font-medium">{errors.description.message}</p>
              )}
              <div className="flex justify-between mt-2">
                <p className="text-sm text-gray-500">
                  Include as much detail as possible
                </p>
                <p className="text-sm text-gray-500">
                  Recommended: 100-500 characters
                </p>
              </div>
            </div>

            {/* Budget */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-900 mb-3">
                <DollarSign className="w-6 h-6 text-yellow-600" />
                <span>Project Budget (₹)</span>
              </label>
              <div className="relative">
                <span className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-xl">₹</span>
                <input
                  type="number"
                  className="w-full pl-12 pr-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all text-lg"
                  placeholder="Enter your budget"
                  {...register("budget", { 
                    required: "Budget is required", 
                    min: 100,
                    max: 1000000 
                  })}
                />
              </div>
              {errors.budget && (
                <p className="mt-3 text-sm text-red-600 font-medium">Minimum budget is ₹100</p>
              )}
              <div className="grid grid-cols-3 gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[name="budget"]');
                    if (input) input.value = 1000;
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  ₹1,000
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[name="budget"]');
                    if (input) input.value = 5000;
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  ₹5,000
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const input = document.querySelector('input[name="budget"]');
                    if (input) input.value = 10000;
                  }}
                  className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center"
                >
                  ₹10,000
                </button>
              </div>
            </div>

            

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 px-6 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:-translate-y-1 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Posting Your Gig...
                </span>
              ) : (
                "🎯 Post Gig & Find Talent"
              )}
            </button>

            {/* Tips */}
            <div className="bg-blue-50 rounded-xl p-6 mt-8">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2" />
                Tips for Getting Quality Bids
              </h3>
              <ul className="space-y-2 text-blue-800 text-sm">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Be clear about deliverables and timeline</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Include required skills and technologies</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Set a realistic budget for quality work</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Respond promptly to freelancer questions</span>
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}