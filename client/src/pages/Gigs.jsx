
import { useEffect, useState } from "react";
import { useGig } from "../context/GigContext";
import { Link } from "react-router-dom";
import { Search, Filter, TrendingUp, Clock, DollarSign } from "lucide-react";

export default function Gigs() {
  const { gigs, fetchGigs } = useGig();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadGigs();
  }, []);

  const loadGigs = async (searchTerm = "") => {
    setLoading(true);
    await fetchGigs(searchTerm);
    setLoading(false);
  };

  const filteredGigs = gigs.filter(gig => {
    if (filter === "active") return gig.status === "active";
    if (filter === "completed") return gig.status === "completed";
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Opportunities
          </h1>
          <p className="text-xl text-gray-600">
            Find the perfect project that matches your skills
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search gigs by title, skills, or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => loadGigs(search)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              Search
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Gigs
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter("completed")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === "completed"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Completed
            </button>
          </div>
        </div>

        {/* Gigs Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-500">Loading opportunities...</p>
          </div>
        ) : filteredGigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
            <Search className="w-16 h-16 text-gray-300 mx-auto" />
            <h3 className="mt-6 text-2xl font-bold text-gray-700">No gigs found</h3>
            <p className="mt-2 text-gray-500">
              {search ? "Try a different search term" : "Check back later for new opportunities"}
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGigs.map((g) => (
              <Link
                to={`/gigs/${g._id}`}
                key={g._id}
                className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 hover:border-blue-200 transform hover:-translate-y-1"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                        g.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-purple-100 text-purple-800"
                      }`}>
                        {g.status}
                      </span>
                    </div>
                    <Clock className="w-5 h-5 text-gray-400" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {g.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 line-clamp-3">
                    {g.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-2xl font-bold text-gray-900">₹{g.budget}</span>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      View Details →
                    </span>
                  </div>
                </div>
                
                <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-t border-gray-100">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <TrendingUp className="w-4 h-4" />
                    <span>Bids: {g.bidsCount || 0}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6">
            <div className="text-3xl font-bold text-blue-700">{gigs.length}</div>
            <div className="text-gray-700 font-medium">Total Gigs</div>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-6">
            <div className="text-3xl font-bold text-green-700">
              {gigs.filter(g => g.status === "active").length}
            </div>
            <div className="text-gray-700 font-medium">Active Projects</div>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-6">
            <div className="text-3xl font-bold text-purple-700">
              {gigs.filter(g => g.status === "completed").length}
            </div>
            <div className="text-gray-700 font-medium">Completed</div>
          </div>
        </div>
      </div>
    </div>
  );
}