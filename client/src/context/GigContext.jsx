import { createContext, useContext, useState } from "react";
import api from "../api/axios";

const GigContext = createContext();

export const GigProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [bids, setBids] = useState([]);

  const fetchGigs = async (search = "") => {
    const res = await api.get(`/gigs?search=${search}`);
    setGigs(res.data);
  };

  const createGig = async (data) => {
    await api.post("/gigs", data);
  };

  const placeBid = async (data) => {
    await api.post("/bids", data);
  };

  const getBidsByGig = async (gigId) => {
    const res = await api.get(`/bids/${gigId}`);
    setBids(res.data);
  };

  const hireBid = async (bidId) => {
    await api.patch(`/bids/${bidId}/hire`);
  };

  return (
    <GigContext.Provider value={{
      gigs, bids,
      fetchGigs, createGig, placeBid, getBidsByGig, hireBid
    }}>
      {children}
    </GigContext.Provider>
  );
};

export const useGig = () => useContext(GigContext);
