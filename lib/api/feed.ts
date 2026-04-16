import axios from 'axios';

const BASE_URL = 'https://bolt.21centurynews.com/api/feed';

export const getFeed = async (page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getFeedByCategory = async (category: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/categories/${category}?${params.toString()}`);
  return res.data;
};

export const getFeedByTag = async (tag: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/tags/${tag}?${params.toString()}`);
  return res.data;
};