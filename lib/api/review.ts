import axios from 'axios';

const BASE_URL = 'https://bolt.21centurynews.com/api/review';

export const getAllReviews = async (page?: number, limit?: number, sort?: 'latest' | 'top') => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (sort) params.append('sort', sort);
  
  const res = await axios.get(`${BASE_URL}?${params.toString()}`);
  return res.data;
};

export const getReviewsByTag = async (tag: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/tag/${tag}?${params.toString()}`);
  return res.data;
};

export const getReviewsByVenue = async (venue: string, page?: number, limit?: number) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  
  const res = await axios.get(`${BASE_URL}/venue/${venue}?${params.toString()}`);
  return res.data;
};

export const getSingleReview = async (id: string) => {
  const res = await axios.get(`${BASE_URL}/${id}`);
  return res.data;
};