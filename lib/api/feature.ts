import axios from 'axios';

const BASE_URL = 'https://bolt.21centurynews.com/api/feature';

export const getAllFeatures = async (page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getFeaturesByTag = async (tag: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/tag/${tag}?${params.toString()}`);
  return res.data;
};

export const getFeaturesByVenue = async (venue: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/venue/${venue}?${params.toString()}`);
  return res.data;
};

export const getSingleFeature = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};