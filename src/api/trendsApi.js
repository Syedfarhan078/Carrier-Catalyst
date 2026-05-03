import api from "./axiosConfig";

/**
 * Fetch live market demand trends for various tech roles
 * @returns {Promise<Array>} Array of trend objects
 */
export const fetchTrends = async () => {
  const response = await api.get("/trends");
  return response.data.data;
};
