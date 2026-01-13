import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const GigContext = createContext();

export const GigProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);

  const [gigLoading, setGigLoading] = useState(false);
  const [gigError, setGigError] = useState(null);

  // fetch gig
  const fetchGigs = async (search = "") => {
    try {
      setGigLoading(true);
      setGigError(null);

      const res = await api.get(`/gigs?search=${search}`);
      setGigs(res.data);

      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch gigs";
      console.error("FETCH GIG ERROR:", msg);
      setGigError(msg);
      return { success: false, message: msg };
    } finally {
      setGigLoading(false);
    }
  };

  // create  gig
  const createGig = async (data) => {
    try {
      setGigLoading(true);
      setGigError(null);

      await api.post("/gigs", data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to create gig";
      console.error("CREATE GIG ERROR:", msg);
      setGigError(msg);
      return { success: false, message: msg };
    } finally {
      setGigLoading(false);
    }
  };

  // place  bid
  const placeBid = async (data) => {
    try {
      setGigLoading(true);
      setGigError(null);

      await api.post("/bids", data);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to place bid";
      console.error("PLACE BID ERROR:", msg);
      setGigError(msg);
      return { success: false, message: msg };
    } finally {
      setGigLoading(false);
    }
  };

  // get  bids by gig
  const getBidsByGig = async (gigId) => {
    try {
      setGigLoading(true);
      setGigError(null);

      const res = await api.get(`/bids/${gigId}`);
      setBids(res.data);

      return { success: true, data: res.data };
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch bids";
      console.error("GET BIDS ERROR:", msg);
      setGigError(msg);
      return { success: false, message: msg };
    } finally {
      setGigLoading(false);
    }
  };

  // Hire  bid
   const hireBid = async (bidId) => {
    try {
      setGigLoading(true);
      await api.patch(`/bids/${bidId}/hire`);
      return true;
    } catch {
      return false;
    } finally {
      setGigLoading(false);
    }
  };

  return (
    <GigContext.Provider
      value={{
        gigs,
        bids,
        gigLoading,
        gigError,
        fetchGigs,
        createGig,
        placeBid,
        getBidsByGig,
        hireBid,
      }}
    >
      {children}
    </GigContext.Provider>
  );
};

export const useGig = () => useContext(GigContext);
